import { Inngest } from "inngest";
import connectDB from "../configs/db.js";
import User from "../models/User.js";

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

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];

