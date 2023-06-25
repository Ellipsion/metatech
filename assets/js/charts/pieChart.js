const data = {
  labels: [
    "Airdrop 1M",
    "Developers 2M",
    "Social & Bounty 2M",
    "Rewards & Marketing 15M",
    "P2P 25M",
    "Private Sale 55M",
  ],
  datasets: [
    {
      label: "Token Distribution",
      data: [1, 2, 2, 15, 25, 55],
      // backgroundColor: (blue_to_pink_gradient = [
      //   "#3BA4A6", // Deep Pink
      //   "rgb(72, 118, 255)", // Light Blue
      //   "rgb(135, 64, 224)", // Lavender Blue
      //   "rgb(200, 64, 200)", // Orchid
      //   "rgb(255, 105, 180)", // Hot Pink
      //   "rgb(162, 13, 255)", // Bright Blue
      // ]),
      backgroundColor: (gradient = [
        "#3232f0",
        "#386fe3",
        "#3facc5",
        "#46e6a7",
        "#4ce68d",
        "#3BA4A6",
      ]),
      offset: 2,
      hoverOffset: 5,
    },
  ],
};
const config = {
  type: "doughnut",
  data: data,
  options: {
    plugins: {
      legend: {
        position: "right",
      },
    },
    elements: {
      arc: {
        borderWidth: 0, // <-- Set this to derired value
        borderColor: "#000",
      },
    },
  },
};
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, config);
