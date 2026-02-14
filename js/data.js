// ============================================
// Skills Data
// ============================================

export const skills = {
  frontend: [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'TypeScript', level: 'Intermediate' },
    { name: 'React', level: 'Advanced' },
    { name: 'Next.js', level: 'Intermediate' },
    { name: 'Three.js', level: 'Intermediate' },
    { name: 'HTML/CSS', level: 'Advanced' },
    { name: 'GSAP', level: 'Intermediate' },
    { name: 'Tailwind CSS', level: 'Advanced' },
  ],
  backend: [
    { name: 'Node.js', level: 'Advanced' },
    { name: 'Express', level: 'Advanced' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'Java', level: 'Intermediate' },
    { name: 'PostgreSQL', level: 'Intermediate' },
    { name: 'MongoDB', level: 'Intermediate' },
    { name: 'REST APIs', level: 'Advanced' },
  ],
  tools: [
    { name: 'Git', level: 'Advanced' },
    { name: 'Docker', level: 'Intermediate' },
    { name: 'VS Code', level: 'Advanced' },
    { name: 'Figma', level: 'Intermediate' },
    { name: 'IntelliJ IDEA', level: 'Intermediate' },
    { name: 'Vercel', level: 'Advanced' },
    { name: 'GitHub Actions', level: 'Intermediate' },
  ],
};

// ============================================
// Projects Data
// ============================================

export const projects = [
  {
    title: '3D Portfolio',
    description: 'An interactive 3D portfolio experience built with Three.js featuring scroll-based navigation, dynamic lighting, and glassmorphism UI. The portfolio you\'re currently viewing!',
    stack: ['Three.js', 'GSAP', 'JavaScript', 'CSS3'],
    githubUrl: 'https://github.com/',
    liveUrl: '#',
  },
  {
    title: 'Writing On Air',
    description: 'A computer-vision based application that allows users to write in the air using hand gestures.',
    stack: ['Python', 'OpenCV', 'Mediapipe'],
    githubUrl: 'https://github.com/CodeItAlone/WritingOnAir',
    liveUrl: 'https://example.com',
  },
  {
    title: 'FocusBuddy',
    description: 'FocusBuddy is a social productivity app that enforces real execution by making progress public within small groups and penalizing inconsistency instead of rewarding fake streaks.',
    stack: ['React Native', 'Spring Boot', 'SQL', 'Git & Github'],
    githubUrl: 'https://github.com/CodeItAlone/FocussBuddy',
    liveUrl: 'https://example.com',
  },
  {
    title: 'My Notes',
    description: 'A modern, full-stack CRUD note-taking application built with Next.js, MongoDB, and Tailwind CSS.',
    stack: ['Next.js', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/CodeItAlone/My-Notes',
    liveUrl: 'https://example.com',
  },
  // {
  //   title: 'Chat Application',
  //   description: 'Real-time messaging application with end-to-end encryption, file sharing, group chats, and online status indicators.',
  //   stack: ['React', 'Firebase', 'WebRTC', 'Node.js'],
  //   githubUrl: 'https://github.com/',
  //   liveUrl: 'https://example.com',
  // },
  // {
  //   title: 'DevOps Monitor',
  //   description: 'A system monitoring dashboard for tracking server health, deployment pipelines, container metrics, and automated alerting.',
  //   stack: ['Python', 'Docker', 'Grafana', 'REST API'],
  //   githubUrl: 'https://github.com/',
  //   liveUrl: null,
  // },
];
