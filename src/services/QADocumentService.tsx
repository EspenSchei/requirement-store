export const getRequirementDocuments = (): RequirementDocument[] => {
  return requirementDocuments;
};

export type RequirementDocument = {
  date: Date;
  customer: string;
  requirements: QuestionAndAnswer[];
};

export type QuestionAndAnswer = {
  question: string;
  answer: string;
};

export const requirementDocuments: RequirementDocument[] = [
  {
    date: new Date(2020, 4, 28),
    customer: 'Example company name',
    requirements: [
      {
        question: `More than 5 years of Java experience`,
        answer: `<Person> has 9 years of experience working in Java, and know ..... 
        and has also worked with ...`,
      },
      {
        question: `More than 3 years of React experience`,
        answer: `<Person> has 4 years of frontend experience in React and TypeScript ...`,
      },
    ],
  },
];
