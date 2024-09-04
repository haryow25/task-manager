const { PrismaClient } = require("@prisma/client");
const moment = require("moment-timezone"); // Install moment-timezone

const prisma = new PrismaClient();

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Create the task in the database
    const task = await prisma.task.create({
      data: { title, description, userId: req.user.id },
    });

    // Convert times to UTC+7
    const taskWithTimezone = {
      ...task,
      createdAt: moment(task.createdAt).tz("Asia/Jakarta").format(),
      updatedAt: moment(task.updatedAt).tz("Asia/Jakarta").format(),
    };

    res.status(201).json(taskWithTimezone);
  } catch (error) {
    res.status(500).json({ error: "Error creating task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
    });

    // Convert times to UTC+7
    const tasksWithTimezone = tasks.map(task => ({
      ...task,
      createdAt: moment(task.createdAt).tz("Asia/Jakarta").format(),
      updatedAt: moment(task.updatedAt).tz("Asia/Jakarta").format(),
    }));

    res.json(tasksWithTimezone);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await prisma.task.update({
      where: { id: parseInt(id), userId: req.user.id },
      data: { title, description, completed },
    });

    // Convert times to UTC+7
    const taskWithTimezone = {
      ...task,
      createdAt: moment(task.createdAt).tz("Asia/Jakarta").format(),
      updatedAt: moment(task.updatedAt).tz("Asia/Jakarta").format(),
    };

    res.json(taskWithTimezone);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: parseInt(id), userId: req.user.id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};
