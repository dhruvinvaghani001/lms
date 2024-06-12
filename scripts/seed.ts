const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        {
          name: "Computer Science",
        },
        {
          name: "Web designer",
        },
        {
          name: "Photography",
        },
        {
          name: "Music",
        },
        {
          name: "Enginnering",
        },
        {
          name: "Fitness",
        },
        {
          name: "Accountting",
        },
      ],
    });
    console.log("success");
  } catch (error) {
    console.log("database sedding error !");
    console.log(error);
  } finally {
    await db.$disconnect();
  }
}

main();
