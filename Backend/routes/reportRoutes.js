
const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

// GET all reports
router.get("/", async (req, res) => {
  try {
    const { departmentId, status, academicYear } = req.query;

    const reports = await prisma.annualReport.findMany({
      where: {
        ...(departmentId && { departmentId }),
        ...(status && { status }),
        ...(academicYear && { academicYear }),
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(reports);
  } catch (error) {
    console.error("Fetch reports error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

// GET report by ID
router.get("/:id", async (req, res) => {
  try {
    const report = await prisma.annualReport.findUnique({
      where: { id: req.params.id },
      include: { department: true },
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    console.error("Fetch report error:", error);
    res.status(500).json({ message: "Failed to fetch report" });
  }
});

// CREATE report
router.post("/", async (req, res) => {
  try {
    const {
      title,
      category,
      academicYear,
      description,
      departmentId,
    } = req.body;

    if (
      !title?.trim() ||
      !category?.trim() ||
      !academicYear?.trim() ||
      !departmentId
    ) {
      return res.status(400).json({
        message: "Title, category, academic year and department are required",
      });
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return res.status(404).json({
        message: "Selected department does not exist",
      });
    }

    const report = await prisma.annualReport.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        academicYear: academicYear.trim(),
        description: description?.trim() || null,
        departmentId,
      },
      include: { department: true },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Failed to create report" });
  }
});

// UPDATE draft report
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      category,
      academicYear,
      description,
    } = req.body;

    const existingReport = await prisma.annualReport.findUnique({
      where: { id: req.params.id },
    });

    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (existingReport.status !== "DRAFT") {
      return res.status(400).json({
        message: "Only draft reports can be edited",
      });
    }

    const report = await prisma.annualReport.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(academicYear !== undefined && {
          academicYear: academicYear.trim(),
        }),
        ...(description !== undefined && {
          description: description.trim() || null,
        }),
      },
      include: { department: true },
    });

    res.json(report);
  } catch (error) {
    console.error("Update report error:", error);
    res.status(500).json({ message: "Failed to update report" });
  }
});

// DELETE draft report
router.delete("/:id", async (req, res) => {
  try {
    const existingReport = await prisma.annualReport.findUnique({
      where: { id: req.params.id },
    });

    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (existingReport.status !== "DRAFT") {
      return res.status(400).json({
        message: "Only draft reports can be deleted",
      });
    }

    await prisma.annualReport.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({ message: "Failed to delete report" });
  }
});

// SUBMIT report
router.patch("/:id/submit", async (req, res) => {
  try {
    const existingReport = await prisma.annualReport.findUnique({
      where: { id: req.params.id },
    });

    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (existingReport.status !== "DRAFT") {
      return res.status(400).json({
        message: "Only draft reports can be submitted",
      });
    }

    const report = await prisma.annualReport.update({
      where: { id: req.params.id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: { department: true },
    });

    res.json(report);
  } catch (error) {
    console.error("Submit report error:", error);
    res.status(500).json({ message: "Failed to submit report" });
  }
});

// START REVIEW
router.patch("/:id/review", async (req, res) => {
  try {
    const existingReport = await prisma.annualReport.findUnique({
      where: { id: req.params.id },
    });

    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (existingReport.status !== "SUBMITTED") {
      return res.status(400).json({
        message: "Only submitted reports can enter review",
      });
    }

    const report = await prisma.annualReport.update({
      where: { id: req.params.id },
      data: {
        status: "UNDER_REVIEW",
        rejectionReason: null,
      },
      include: { department: true },
    });

    res.json(report);
  } catch (error) {
    console.error("Start review error:", error);
    res.status(500).json({ message: "Failed to start review" });
  }
});

// APPROVE REPORT
router.patch("/:id/approve", async (req, res) => {
  try {
    const existingReport = await prisma.annualReport.findUnique({
      where: { id: req.params.id },
    });

    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (existingReport.status !== "UNDER_REVIEW") {
      return res.status(400).json({
        message: "Only reports under review can be approved",
      });
    }

    const report = await prisma.annualReport.update({
      where: { id: req.params.id },
      data: {
        status: "APPROVED",
        rejectionReason: null,
      },
      include: { department: true },
    });

    res.json(report);
  } catch (error) {
    console.error("Approve report error:", error);
    res.status(500).json({ message: "Failed to approve report" });
  }
});

// REJECT REPORT
router.patch("/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "A rejection reason is required",
      });
    }

    const existingReport = await prisma.annualReport.findUnique({
      where: { id: req.params.id },
    });

    if (!existingReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (existingReport.status !== "UNDER_REVIEW") {
      return res.status(400).json({
        message: "Only reports under review can be rejected",
      });
    }

    const report = await prisma.annualReport.update({
      where: { id: req.params.id },
      data: {
        status: "REJECTED",
        rejectionReason: reason.trim(),
      },
      include: { department: true },
    });

    res.json(report);
  } catch (error) {
    console.error("Reject report error:", error);
    res.status(500).json({ message: "Failed to reject report" });
  }
});

module.exports = router;
