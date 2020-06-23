import React, { useState, useEffect } from 'react';
import {
  RequirementDocument,
  getRequirementDocuments,
} from '../services/QADocumentService';
import Fuse from 'fuse.js';

const QuestionAnswerSearch = (props: Props) => {
  const [fuse, setFuse] = useState<any>(null);
  const [stats, setStats] = useState<{ qaCount: number; docCount: number }>();
  const [filteredQaList, setFilteredQaList] = useState<QAOut[]>([]);
  const [requirementDocuments, setRequirementDocuments] = useState<
    RequirementDocument[]
  >([]);

  useEffect(() => {
    const requirementDocs = getRequirementDocuments();
    setRequirementDocuments(requirementDocs);

    let answerCount: number = 0;
    let requirements: QAOut[] = [];
    requirementDocs.forEach((doc) => {
      doc.requirements.forEach((req) => {
        answerCount++;
        requirements.push({
          question: req.question,
          answer: req.answer,
          customer: doc.customer,
          date: doc.date,
        });
      });
    });

    const reqFuse = new Fuse(requirements, {
      keys: ['question', 'answer'],
      useExtendedSearch: true,
      threshold: 0.0,
    });

    setStats({ qaCount: answerCount, docCount: requirementDocs.length });
    setFuse(reqFuse);
  }, []);

  // Triggered every time the "question" in props is changed
  useEffect(() => {
    const result = fuse?.search({
      $or: [
        { question: `'${props.question}` },
        { answer: `'${props.question}` },
      ],
    });

    const filteredQAs: QAOut[] = [];
    result?.forEach((res: any) => {
      filteredQAs.push({
        question: res.item.question,
        answer: res.item.answer,
        customer: res.item.customer,
        date: res.item.date,
      });
    });

    setFilteredQaList(filteredQAs);
  }, [props, requirementDocuments]);

  function getUniqueDocuments(): number {
    return new Set(filteredQaList.map((qa) => qa.customer + qa.date)).size;
  }

  return (
    <div>
      {props.question.length > 0 ? (
        <p>
          Found {filteredQaList.length} results for{' '}
          <strong>{props.question}</strong> in {getUniqueDocuments()} document
          {filteredQaList.length > 1 ? 's' : ''}.
        </p>
      ) : (
        <div>
          {stats ? (
            <p>
              {stats.qaCount} question{stats.qaCount > 1 ? 's' : ''} loaded from{' '}
              {stats.docCount} document
              {stats.docCount > 1 ? 's' : ''}.
            </p>
          ) : (
            'Loading...'
          )}
        </div>
      )}
      {filteredQaList.length > 0 && props.question ? (
        <table>
          <tbody>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Source</th>
              <th>ReqDate</th>
            </tr>
            {filteredQaList
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((qa, index) => (
                <tr key={index}>
                  <td>{qa.question}</td>
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: qa.answer.replace(/\n/g, '<br /><br />'),
                      }}
                    />
                  </td>

                  <td>{qa.customer}</td>
                  <td>
                    {qa.date.getFullYear()}-{qa.date.getMonth()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

type QAOut = {
  question: string;
  answer: string;
  customer: string;
  date: Date;
};

type Props = {
  question: string;
};

export default QuestionAnswerSearch;
