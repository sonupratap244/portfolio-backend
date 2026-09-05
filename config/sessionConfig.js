export const SESSION_CONFIG = {
  durations: {
    30: {
      price: 99,
      label: "30 Minutes",
    },
    45: {
      price: 199,
      label: "45 Minutes",
    },
    60: {
      price: 299,
      label: "60 Minutes",
    },
  },

  modes: ["video", "phone", "in-person"],

  currency: "INR",
};

export const getSessionPrice = (duration) => {
  return SESSION_CONFIG.durations[duration]?.price || null;
};