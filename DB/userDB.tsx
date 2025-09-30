const SuggestedUsers = [
  {
    id: 1,
    name: "Agbeke",
    age: 18,
    image:
      "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    name: "B",
    age: 25,
    image:
      "https://images.pexels.com/photos/1408978/pexels-photo-1408978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    name: "C",
    age: 24,
    image:
      "https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 4,
    name: "D",
    age: 26,
    image:
      "https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 5,
    name: "E",
    age: 23,
    image:
      "https://images.pexels.com/photos/227288/pexels-photo-227288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 6,
    name: "F",
    age: 27,
    image:
      "https://images.pexels.com/photos/3153200/pexels-photo-3153200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 7,
    name: "G",
    age: 22,
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 8,
    name: "H",
    age: 28,
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];
const matchwithgoalData = [
  {
    id: 1,
    name: "suhani",
    age: 23,
    image:
      "https://plus.unsplash.com/premium_photo-1661729781158-8abc559a94c5?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "A long-term relationship",
  },
  {
    id: 2,
    name: "sukanya",
    age: 22,
    image:
      "https://images.unsplash.com/photo-1622782045716-a05bcc4f5ae8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "A long-term relationship",
  },
  {
    id: 3,
    name: "pallabi",
    age: 23,
    image:
      "https://images.unsplash.com/photo-1622049605334-72e1e4432346?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "A long-term relationship",
  },
  {
    id: 4,
    name: "manasi",
    age: 23,
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1727&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "A long-term relationship",
  },
  {
    id: 5,
    name: "ananya",
    age: 24,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Looking for something meaningful",
  },
];

const RECOMMENDATION_USER = [
  {
    id: 6,
    name: "suhani",
    age: 23,
    image:
      "https://plus.unsplash.com/premium_photo-1682089810582-f7b200217b67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "A long-term relationship",
  },
  {
    id: 7,
    name: "rahi",
    age: 23,
    image:
      "https://plus.unsplash.com/premium_photo-1661634439983-f934c191b4fd?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "A long-term relationship",
  },
  {
    id: 8,
    name: "sonia",
    age: 23,
    image:
      "https://plus.unsplash.com/premium_photo-1661729781158-8abc559a94c5?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "A long-term relationship",
  },
  {
    id: 9,
    name: "priya",
    age: 24,
    image:
      "https://images.unsplash.com/photo-1504973960431-7a37e4b3f2c4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Seeking a deep connection",
  },
  {
    id: 10,
    name: "tanisha",
    age: 22,
    image:
      "https://images.unsplash.com/photo-1532073150508-0c1df022bdd1?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bio: "Looking for my perfect match",
  },
];

export { SuggestedUsers, RECOMMENDATION_USER, matchwithgoalData };
