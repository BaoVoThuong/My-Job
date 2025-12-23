// src/services/jobService.jsx

import { mockJobs } from "../data/mockJobs";

/**
 * =====================================
 * WTD-30 – Get job list
 * GET /api/findjob
 * =====================================
 */
export async function getJobs(params = {}) {
  try {
    let jobs = [...mockJobs];

    // 1️⃣ Keyword search
    if (params.q) {
      const keyword = params.q.toLowerCase();
      jobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(keyword)
      );
    }

    // 2️⃣ Location
    if (params.location) {
      jobs = jobs.filter((job) => job.location === params.location);
    }

    // 3️⃣ Level
    if (params.level) {
      jobs = jobs.filter((job) => job.level === params.level);
    }

    // 4️⃣ Employment type
    if (params.employmentType) {
      jobs = jobs.filter(
        (job) => job.employmentType === params.employmentType
      );
    }

    // 5️⃣ Salary range
    if (params.salaryMin !== undefined) {
      jobs = jobs.filter(
        (job) => job.salaryMinNum >= params.salaryMin
      );
    }

    if (params.salaryMax !== undefined) {
      jobs = jobs.filter(
        (job) => job.salaryMaxNum <= params.salaryMax
      );
    }

    // 6️⃣ Chỉ lấy job OPEN
    jobs = jobs.filter((job) => job.status === "OPEN");

    // Pagination
    const page = Number(params.page) || 1;
    const size = Number(params.size) || 5;

    const start = (page - 1) * size;
    const end = start + size;

    return {
      items: jobs.slice(start, end),
      meta: {
        page,
        size,
        totalItems: jobs.length,
        totalPages: Math.ceil(jobs.length / size),
      },
    };
  } catch (error) {
    if (error?.status === 400) {
      throw new Error(error.message || "Bad Request");
    }

    throw new Error("Có lỗi xảy ra, vui lòng thử lại sau.");
  }
}

/**
 * =====================================
 * WTD-31 – Get job detail
 * GET /api/findjob/:jobId
 * =====================================
 */
export async function getJobDetail(jobId) {
  try {
    const job = mockJobs.find(
      (item) => String(item.id) === String(jobId)
    );

    // 404 – job không tồn tại hoặc không OPEN
    if (!job || job.status !== "OPEN") {
      const error = new Error("This job is no longer available.");
      error.status = 404;
      throw error;
    }

    // 200 OK – giống backend
    return {
      success: true,
      data: job,
      message: null,
    };
  } catch (error) {
    if (error.status === 404) throw error;

    const serverError = new Error(
      "Không thể tải thông tin việc làm, vui lòng thử lại sau."
    );
    serverError.status = 500;
    throw serverError;
  }
}
