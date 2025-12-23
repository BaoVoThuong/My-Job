const profileService = {
  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          fullName: 'Nguyễn Văn A',
          email: 'test@gmail.com',
          phone: '0909123456',
          headline: 'Senior React Developer',
          summary: 'Tôi là lập trình viên đam mê...',
          location: 'Hồ Chí Minh',
          website: 'https://mywebsite.com'
        });
      }, 500);
    });
  },
  updateProfile: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Đã lưu:", data);
        resolve({ success: true });
      }, 1000);
    });
  }
};
export default profileService;