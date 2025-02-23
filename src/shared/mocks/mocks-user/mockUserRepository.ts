export const mockUserRepository = {
  prepare: jest.fn().mockImplementation((query: string) => ({
    bind: jest.fn().mockImplementation((email: string) => ({
      first: jest.fn().mockResolvedValue(
        email === 'teste@gmail.com'
          ? {
              id: 1,
              email,
              streak: 'Casual',
              streakDays: 1,
            }
          : null
      ),
    })),
  })),
};
