describe("worker", () => {
  beforeEach(() => {
    jest.useFakeTimers(); 
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should log on each interval", () => {
    require("../worker/worker"); 

    jest.advanceTimersByTime(10000);

    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it("should log correct JSON structure", () => {
    require("../worker/worker");

    jest.advanceTimersByTime(10000);

    const logged = JSON.parse(console.log.mock.calls[0][0]);

    expect(logged).toMatchObject({
      level: "info",
      message: "Updating timestamp...",
    });
    expect(logged.time).toBeDefined();
  });

  it("should log multiple times over multiple intervals", () => {
    require("../worker/worker");

    jest.advanceTimersByTime(30000);

    expect(console.log).toHaveBeenCalledTimes(3);
  });
});