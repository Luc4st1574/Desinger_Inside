export const mockFeedbackData = {
  all: [
    {
      id: "BSP-0001",
      title: "Design feels a bit off on mobile",
      submittedBy: {
        id: "1",
        name: "Anna Castillo",
        avatarUrl: "/assets/avatars/avatar1.svg"
      },
      role: "Client",
      category: "General Feedback",
      submittedDate: "2024-12-14",
      assignees: [
        { id: "1", name: "Michelle Cruz", avatarUrl: "/assets/avatars/avatar1.svg" },
        { id: "2", name: "Bernard Co", avatarUrl: "/assets/avatars/avatar2.svg" },
        { id: "3", name: "Zeus Roman", avatarUrl: "/assets/avatars/avatar3.svg" }
      ],
      priority: "Low",
      status: "Queued",
      description: "The design feels a bit off on mobile devices. It seems that certain elements are not properly aligned, which affects the overall user experience. Additionally, the navigation could be more intuitive to enhance usability. Overall, a few adjustments could significantly improve the mobile interface."
    },
    {
      id: "BSP-0002", 
      title: "Button state not consistent",
      submittedBy: {
        id: "2",
        name: "Marco Liang",
        avatarUrl: "/assets/avatars/marco.jpg"
      },
      role: "Designer",
      category: "Bespire Team",
      submittedDate: "2024-12-24",
       assignees: [
        { id: "1", name: "Michelle Cruz", avatarUrl: "/assets/avatars/avatar1.svg" },
        { id: "2", name: "Bernard Co", avatarUrl: "/assets/avatars/avatar2.svg" },
        { id: "3", name: "Zeus Roman", avatarUrl: "/assets/avatars/avatar3.svg" }
      ],
      priority: "Medium",
      status: "In Progress",
      description: "The button states across the application are not consistent. Some buttons have hover effects while others don't. The disabled state styling also varies between different sections of the app."
    },
    {
      id: "BSP-0003",
      title: "Need more font options for headings",
      submittedBy: {
        id: "3",
        name: "Layla Mehta",
        avatarUrl: "/assets/avatars/layla.jpg"
      },
      role: "Creative Director",
      category: "Feature Request",
      submittedDate: "2024-12-28",
     assignees: [
        { id: "1", name: "Michelle Cruz", avatarUrl: "/assets/avatars/avatar1.svg" },
        { id: "2", name: "Bernard Co", avatarUrl: "/assets/avatars/avatar2.svg" },
        { id: "3", name: "Zeus Roman", avatarUrl: "/assets/avatars/avatar3.svg" }
      ],
      priority: "High",
      status: "Pending",
      description: "We need more font options for headings in the brand guidelines section. Currently, there are limited choices which restricts creative flexibility for our design teams."
    },
    {
      id: "BSP-0004",
      title: "Icons not rendering in Safari browser",
      submittedBy: {
        id: "4",
        name: "Felix Mendez",
        avatarUrl: "/assets/avatars/felix.jpg"
      },
      role: "Admin",
      category: "Feature Request", 
      submittedDate: "2024-12-29",
     assignees: [
        { id: "1", name: "Michelle Cruz", avatarUrl: "/assets/avatars/avatar1.svg" },
        { id: "2", name: "Bernard Co", avatarUrl: "/assets/avatars/avatar2.svg" },
        { id: "3", name: "Zeus Roman", avatarUrl: "/assets/avatars/avatar3.svg" }
      ],
      priority: "Critical",
      status: "Completed",
      description: "SVG icons are not rendering properly in Safari browser. This affects the user experience for Safari users and needs immediate attention."
    }
  ],
  queued: [
    {
      id: "BSP-0001",
      title: "Design feels a bit off on mobile",
      submittedBy: {
        id: "1",
        name: "Anna Castillo",
        avatarUrl: "/assets/avatars/anna.jpg"
      },
      role: "Client",
      category: "General Feedback",
      submittedDate: "2024-12-14",
    assignees: [
        { id: "1", name: "Michelle Cruz", avatarUrl: "/assets/avatars/avatar1.svg" },
        { id: "2", name: "Bernard Co", avatarUrl: "/assets/avatars/avatar2.svg" },
        { id: "3", name: "Zeus Roman", avatarUrl: "/assets/avatars/avatar3.svg" }
      ],
      priority: "Low",
      status: "Queued",
      description: "The design feels a bit off on mobile devices. It seems that certain elements are not properly aligned, which affects the overall user experience. Additionally, the navigation could be more intuitive to enhance usability. Overall, a few adjustments could significantly improve the mobile interface."
    }
  ],
  "in-progress": [
    {
      id: "BSP-0002",
      title: "Button state not consistent", 
      submittedBy: {
        id: "2",
        name: "Marco Liang",
        avatarUrl: "/assets/avatars/marco.jpg"
      },
      role: "Designer",
      category: "Bespire Team",
      submittedDate: "2024-12-24",
     assignees: [
        { id: "1", name: "Michelle Cruz", avatarUrl: "/assets/avatars/avatar1.svg" },
        { id: "2", name: "Bernard Co", avatarUrl: "/assets/avatars/avatar2.svg" },
        { id: "3", name: "Zeus Roman", avatarUrl: "/assets/avatars/avatar3.svg" }
      ],
      priority: "Medium",
      status: "In Progress",
      description: "The button states across the application are not consistent. Some buttons have hover effects while others don't. The disabled state styling also varies between different sections of the app."
    }
  ],
  pending: [
    {
      id: "BSP-0003",
      title: "Need more font options for headings",
      submittedBy: {
        id: "3",
        name: "Layla Mehta",
        avatarUrl: "/assets/avatars/layla.jpg"
      },
      role: "Creative Director",
      category: "Feature Request",
      submittedDate: "2024-12-28",
    assignees: [
        { id: "1", name: "Michelle Cruz", avatarUrl: "/assets/avatars/avatar1.svg" },
        { id: "2", name: "Bernard Co", avatarUrl: "/assets/avatars/avatar2.svg" },
        { id: "3", name: "Zeus Roman", avatarUrl: "/assets/avatars/avatar3.svg" }
      ],
      priority: "High",
      status: "Pending",
      description: "We need more font options for headings in the brand guidelines section. Currently, there are limited choices which restricts creative flexibility for our design teams."
    }
  ],
  completed: [
    {
      id: "BSP-0004",
      title: "Icons not rendering in Safari browser",
      submittedBy: {
        id: "4",
        name: "Felix Mendez",
        avatarUrl: "/assets/avatars/felix.jpg"
      },
      role: "Admin",
      category: "Feature Request",
      submittedDate: "2024-12-29",
   assignees: [
        { id: "1", name: "Michelle Cruz", avatarUrl: "/assets/avatars/avatar1.svg" },
        { id: "2", name: "Bernard Co", avatarUrl: "/assets/avatars/avatar2.svg" },
        { id: "3", name: "Zeus Roman", avatarUrl: "/assets/avatars/avatar3.svg" }
      ],
      priority: "Critical",
      status: "Completed",
      description: "SVG icons are not rendering properly in Safari browser. This affects the user experience for Safari users and needs immediate attention."
    }
  ]
};
