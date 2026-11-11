import { eventType, Inngest } from "inngest";
import connectDB from "../configs/db.js";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodeMailer.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";

export const inngest = new Inngest({
  id: "Groove",
});

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = event.data;

      let username = email_addresses[0].email_address.split("@")[0];

      const existingUser = await User.findOne({ username });

      if (existingUser) {
        username = `${username}${Math.floor(Math.random() * 10000)}`;
      }

      await User.create({
        _id: id,
        email: email_addresses[0].email_address,
        full_name: `${first_name || ""} ${last_name || ""}`.trim(),
        profile_picture: image_url || "",
        username,
      });

      console.log("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = event.data;

      let username = email_addresses[0].email_address.split("@")[0];

      const existingUser = await User.findOne({
        username,
        _id: { $ne: id },
      });

      if (existingUser) {
        username = `${username}${Math.floor(Math.random() * 10000)}`;
      }

      await User.findByIdAndUpdate(id, {
        email: email_addresses[0].email_address,
        full_name: `${first_name || ""} ${last_name || ""}`.trim(),
        profile_picture: image_url || "",
        username,
      });

      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const { id } = event.data;

      await User.findByIdAndDelete(id);

      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
);

//Inngest function to send reminder whne a new connection in added
// Inngest function to send reminder when a new connection is added
const sendConnectionRequestReminder = inngest.createFunction(
  {
    id: "send-new-connection-request-reminder",
    triggers: [{ event: "app/connection-request" }],
  },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    const { connection, subject, body } = await step.run(
      "send-connection-request-mail",
      async () => {
        const connection = await Connection.findById(connectionId).populate(
          "from_user_id to_user_id"
        );

        const subject = "👋 New Connection Request";

        const body = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hi ${connection.to_user_id.full_name},</h2>

            <p>
              You have a new connection request from
              ${connection.from_user_id.full_name} -
              @${connection.from_user_id.username}
            </p>

            <p>
              Click
              <a
                href="${process.env.FRONTEND_URL}/connections"
                style="color: #10b981;"
              >
                here
              </a>
              to accept or reject the request
            </p>

            <br />

            <p>Thanks,<br />PingUp - Stay Connected</p>
          </div>
        `;

        return { connection, subject, body };
      }
    );

    await sendEmail({
      to: connection.to_user_id.email,
      subject,
      body,
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await step.sleepUntil("wait-for-24-hours", in24Hours);

    await step.run("send-connection-request-reminder", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );

      if (connection.status === "accepted") {
        return { message: "Connection Already Accepted" };
      }

      const subject = "👋 New Connection Request";

      const body = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>

          <p>
            You have a new connection request from
            ${connection.from_user_id.full_name} -
            @${connection.from_user_id.username}
          </p>

          <p>
            Click
            <a
              href="${process.env.FRONTEND_URL}/connections"
              style="color: #10b981;"
            >
              here
            </a>
            to accept or reject the request
          </p>

          <br />

          <p>Thanks,<br />PingUp - Stay Connected</p>
        </div>
      `;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });

      return { message: "Reminder Sent." };
    });
  }
);

// Inngest Function to delete story ater 24 hours
const deleteStory = inngest.createFunction(
  {id:'story-delete'},
  {event:'app/story.delete'},
  async ({event,step}) => {
    const {stroyId} = event.data;
    const in24Hours = new Date(Date.now() + 24*60*60*1000)
    await step.sleepUntil('wait-for-24-hours',in24Hours)
    await step.run("delete-story",async () => {
      await Story.findByIdAndDelete(stroyId)
      return {message:"Story deleted."}
    })
  }
)

const sendNotificationOfUnseenMessages = inngest.createFunction(
  { id: "send-unseen-messages-notification"},
  { cron : "TZ/America/New_York 0 9 * * *"}, // Every day a 9 AM

  async ({step}) => {
    const messages = await Message.find({seen: false}).populate('to_user_id');
    const unseenCount = {}

    messages.map(message=>{
      unseenCount[message.to_user_id._id] = (unseenCount[message.to_user_id._id] || 0) + 1;
    })

    for (const userId in unseenCount) {
      
      const user = await User.findById(userId);

      const subject = `${unseenCount[userId]} Unseen messages`;

      
const body = `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2>Hello ${user.name || "there"}!</h2>

    <p>You have <strong>${unseenCount[userId]} unseen messages</strong> waiting for you.</p>

    <p>Don't miss out on your conversations. Come back and check your messages!</p>

    <a href="${process.env.FRONTEND_URL}/messages"
       style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">
        View Messages
    </a>

    <p style="margin-top: 25px; font-size: 12px; color: #888;">
        Thank you for using MessageHub!
    </p>
</div>
`;

    await sendEmail({
      to: user.email,
      subject,
      body
    })
      
    }

    return {message:"Notification sent."}
  }
)

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendConnectionRequestReminder,
  deleteStory,
  sendNotificationOfUnseenMessages 

];

