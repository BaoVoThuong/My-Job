// src/services/jobService.jsx

import { mockJobs } from "../data/mockJobs";


/**
 * Service: Get job list
 * Dùng lại cho nhiều màn hình (Job List, Favorite Jobs, Apply Job...)
 *
 * @param {Object} params
 * @param {string} params.q - keyword search
 * @param {string} params.location
 * @param {string} params.level
 * @param {number} params.page
 * @param {number} params.size
 * @param {string} params.employmentType
 * @param {number} params.salaryMin
 * @param {number} params.salaryMax
 */
export async function getJobs(params = {}) {
  try {
    // Clone data để tránh mutate mock data gốc
    let jobs = [...mockJobs];

    /* =======================
       FILTER SECTION
    ======================= */

    // 1️⃣ Keyword search
    if (params.q) {
      const keyword = params.q.toLowerCase();
      jobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(keyword)
      );
    }

    // 2️⃣ Location filter
    if (params.location) {
      jobs = jobs.filter((job) => job.location === params.location);
    }

    // 3️⃣ Level filter
    if (params.level) {
      jobs = jobs.filter((job) => job.level === params.level);
    }

    // 4️⃣ Employment type filter
    if (params.employmentType) {
      jobs = jobs.filter(
        (job) => job.employmentType === params.employmentType
      );
    }

    // 5️⃣ Salary range filter
    if (params.salaryMin !== undefined) {
      jobs = jobs.filter((job) => job.salary >= params.salaryMin);
    }

    if (params.salaryMax !== undefined) {
      jobs = jobs.filter((job) => job.salary <= params.salaryMax);
    }

    /* =======================
       PAGINATION SECTION
    ======================= */

    const page = Number(params.page) || 1;
    const size = Number(params.size) || 5;

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    const items = jobs.slice(startIndex, endIndex);

    const meta = {
      page,
      size,
      totalItems: jobs.length,
      totalPages: Math.ceil(jobs.length / size),
    };

    // Giả lập response backend
    return {
      items,
      meta,
    };
  } catch (error) {
    /* =======================
       ERROR HANDLING (WTD-29)
    ======================= */

    // 400 error
    if (error?.status === 400) {
      throw new Error(error.message || "Bad Request");
    }

    // 500 error
    if (error?.status >= 500) {
      throw new Error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }

    throw error;
  }
}
