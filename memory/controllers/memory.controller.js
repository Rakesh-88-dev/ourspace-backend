const asyncHandler = require("../../middleware/asyncHandler");
const memoryService = require("../services/memory.service");

class MemoryController {
  // ==========================================
  // Create Memory
  // ==========================================

  createMemory = asyncHandler(async (req, res) => {
    const memory = await memoryService.createMemory(
      req.user._id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Memory created successfully.",
      data: memory,
    });
  });

  // ==========================================
  // Get Memories
  // ==========================================

  getMemories = asyncHandler(async (req, res) => {
    const { space = "shared" } = req.query;

    const memories = await memoryService.getMemories(
      req.user._id,
      space
    );

    return res.status(200).json({
      success: true,
      data: memories,
    });
  });

  // ==========================================
  // Get On This Day Memories
  // ==========================================

  getOnThisDay = asyncHandler(async (req, res) => {
    const memories = await memoryService.getOnThisDay(
      req.user._id
    );

    return res.status(200).json({
      success: true,
      data: memories,
    });
  });

  // ==========================================
  // Update Memory
  // ==========================================

  updateMemory = asyncHandler(async (req, res) => {
    const memory = await memoryService.updateMemory(
      req.user._id,
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Memory updated successfully.",
      data: memory,
    });
  });

  // ==========================================
  // Delete Memory
  // ==========================================

  deleteMemory = asyncHandler(async (req, res) => {
    const result = await memoryService.deleteMemory(
      req.user._id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  });

  // ==========================================
  // Toggle Like
  // ==========================================

  toggleLike = asyncHandler(async (req, res) => {
    const memory = await memoryService.toggleLike(
      req.user._id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Memory like updated successfully.",
      data: memory,
    });
  });
}

module.exports = new MemoryController();