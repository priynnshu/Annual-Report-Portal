
const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// GET all departments
router.get("/", async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(departments);
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

// GET department by ID
router.get("/:id", async (req, res) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: req.params.id },
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(department);
  } catch (error) {
    console.error("Get department error:", error);
    res.status(500).json({ message: "Failed to fetch department" });
  }
});

// CREATE department
router.post("/", async (req, res) => {
  try {
    const { name, code, head, total } = req.body;

    if (!name?.trim() || !code?.trim() || !head?.trim()) {
      return res.status(400).json({
        message: "Name, code and department head are required",
      });
    }

    const department = await prisma.department.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        head: head.trim(),
        total: Number(total) || 0,
      },
    });

    res.status(201).json(department);
  } catch (error) {
    console.error("Create department error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Department code already exists",
      });
    }

    res.status(500).json({ message: "Failed to create department" });
  }
});

// UPDATE department
router.put("/:id", async (req, res) => {
  try {
    const { name, code, head, total } = req.body;

    if (!name?.trim() || !code?.trim() || !head?.trim()) {
      return res.status(400).json({
        message: "Name, code and department head are required",
      });
    }

    const department = await prisma.department.update({
      where: { id: req.params.id },
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        head: head.trim(),
        total: Number(total) || 0,
      },
    });

    res.json(department);
  } catch (error) {
    console.error("Update department error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ message: "Department not found" });
    }

    if (error.code === "P2002") {
      return res.status(409).json({ message: "Department code already exists" });
    }

    res.status(500).json({ message: "Failed to update department" });
  }
});

// DELETE department
router.delete("/:id", async (req, res) => {
  try {
    await prisma.department.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete department error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(500).json({ message: "Failed to delete department" });
  }
});

module.exports = router;
