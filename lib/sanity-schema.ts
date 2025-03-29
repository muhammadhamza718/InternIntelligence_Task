// This file defines the Sanity schema for the user model
// You'll need to import this in your Sanity schema folder

export const userSchema = {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: { required: () => { email: () => void } }) =>
        Rule.required().email(),
    },
    {
      name: "password",
      title: "Password",
      type: "string",
      hidden: true, // Hide in Sanity Studio
    },
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "User", value: "user" },
        ],
      },
      initialValue: "user",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
    },
  ],
  indexes: [
    {
      name: "email",
      fields: ["email"],
      unique: true,
    },
  ],
};
