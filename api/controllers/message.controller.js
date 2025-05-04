import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  try {
    console.log("Message");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add message" });
  }
};
