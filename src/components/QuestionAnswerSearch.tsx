import React, { useState, useEffect } from 'react';
import {
  RequirementDocument,
  getRequirementDocuments,
} from '../services/QADocumentService';

const QuestionAnswerSearch = (props: Props) => {
  const [stats, setStats] = useState<{ qaCount: number; docCount: number }>();
  const [filteredQaList, setFilteredQaList] = useState<QAOut[]>([]);
  const [requirementDocuments, setRequirementDocuments] = useState<
    RequirementDocument[]
  >([]);

  useEffect(() => {
    setRequirementDocuments(getRequirementDocuments());
  }, []);

  useEffect(() => {
    const filteredQAs: QAOut[] = [];
    let answerCount: number = 0;

    requirementDocuments.forEach((doc) => {
      answerCount += doc.requirements.length;
      doc.requirements.forEach((req) => {
        if (
          props.question.length > 0 &&
          (req.answer.toLowerCase().includes(props.question.toLowerCase()) ||
            req.question.toLowerCase().includes(props.question.toLowerCase()))
        )
          filteredQAs.push({
            question: req.question,
            answer: req.answer,
            customer: doc.customer,
            date: doc.date,
          });
      });

      setStats({ qaCount: answerCount, docCount: requirementDocuments.length });
    });

    setFilteredQaList(filteredQAs);
  }, [props, requirementDocuments]);

  function getUniqueDocuments(): number {
    return new Set(filteredQaList.map((qa) => qa.customer)).size;
  }

  return (
    <div>
      {props.question.length > 0 ? (
        <p>
          {filteredQaList.length} results for <strong>{props.question}</strong>{' '}
          with {getUniqueDocuments()} client
          {filteredQaList.length > 1 ? 's' : ''}.
        </p>
      ) : (
        <div>
          {stats ? (
            <p>
              {stats.qaCount} question{stats.qaCount > 1 ? 's' : ''} loaded from{' '}
              {stats.docCount} document{stats.docCount > 1 ? 's' : ''}.
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
                        __html: qa.answer.replace(/\n/, '<br /><br />'),
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
