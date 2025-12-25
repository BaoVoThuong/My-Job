import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createJob } from '../../services/employerService';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    jobRole: '',
    minSalary: '',
    maxSalary: '',
    salaryType: 'monthly',
    education: '',
    experience: '',
    jobType: '',
    jobLevel: '',
    vacancies: '',
    expirationDate: '',
    description: '',
    responsibilities: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      await createJob(formData);
      toast.success('Job created successfully!');

      // Redirect to employer job list after successful creation
      setTimeout(() => {
        navigate('/employer/jobs');
      }, 1500);
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.message || 'Error creating job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add job title, role, vacancies etc"
              />
            </div>

            {/* Tags and Job Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Job keyword, tags etc..."
                />
              </div>
              
              <div>
                <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role
                </label>
                <select
                  id="jobRole"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Sales Representative">Sales Representative</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Salary */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Salary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Salary
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="minSalary"
                      name="minSalary"
                      value={formData.minSalary}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Minimum salary"
                    />
                    <span className="absolute right-3 top-2 text-gray-500 text-sm">VND</span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Salary
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="maxSalary"
                      name="maxSalary"
                      value={formData.maxSalary}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Maximum salary"
                    />
                    <span className="absolute right-3 top-2 text-gray-500 text-sm">VND</span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="salaryType" className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Type
                  </label>
                  <select
                    id="salaryType"
                    name="salaryType"
                    value={formData.salaryType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Advance Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Advance Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Second row of Advance Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700 mb-2">
                  Vacancies
                </label>
                <input
                  type="number"
                  id="vacancies"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Number of vacancies"
                  min="1"
                />
              </div>
              
              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="DD/MM/YYYY"
                />
              </div>
              
              <div>
                <label htmlFor="jobLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Level
                </label>
                <select
                  id="jobLevel"
                  name="jobLevel"
                  value={formData.jobLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                </select>
              </div>
            </div>

            {/* Description & Responsibility */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Description & Responsibility</h3>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add your job description..."
                />
                {/* Rich text toolbar would go here */}
                <div className="flex items-center gap-2 mt-2 text-gray-400">
                  <button type="button" className="p-1 hover:text-gray-600">
                    <span className="font-bold">B</span>
                  </button>
                  <button type="button" className="p-1 hover:text-gray-600">
                    <span className="italic">I</span>
                  </button>
                  <button type="button" className="p-1 hover:text-gray-600">
                    <span className="underline">U</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                  Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add your job responsibilities..."
                />
                {/* Rich text toolbar would go here */}
                <div className="flex items-center gap-2 mt-2 text-gray-400">
                  <button type="button" className="p-1 hover:text-gray-600">
                    <span className="font-bold">B</span>
                  </button>
                  <button type="button" className="p-1 hover:text-gray-600">
                    <span className="italic">I</span>
                  </button>
                  <button type="button" className="p-1 hover:text-gray-600">
                    <span className="underline">U</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Post Job...' : 'Post Job →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;
