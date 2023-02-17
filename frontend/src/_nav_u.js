export default {
  items: [
    {
      name: "Tổng Quan",
      url: "/report",
      icon: "icon-speedometer",
      badge: {
        variant: "info",
        text: "NEW",
      },
    },
    {
      title: true,
      name: "EKYC ",
      wrapper: {
        // optional wrapper object
        element: "", // required valid HTML5 element tag
        attributes: {}, // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: "", // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Phân tích ',
      url: '/project/view',
      icon: "icon-pencil",
    },
    {
      name: 'Checks',
      url: '/pageGroupManagement',
      icon: "icon-screen-desktop",
    },
    {
      name: 'Cài Đặt',
      url: '/infManagement',
      icon: "icon-user",
    }
  ],
};
