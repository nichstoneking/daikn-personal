import React from "react";
import InprogressRepo from "../components/inprogress_repo";
import CompletedRepo from "../components/completed_repo";

const Analytics: React.FC = () => {
  const inProgress = [
    {
      label: "Go Interpreter",
      link: "https://github.com/daikonk/go_interpreter",
      info: "a basic code interpreter written in go, my first exposure to go (and TDD)",
      owner: "daikonk",
      repo: "go_interpreter",
    },
    {
      label: "Mocktalk",
      link: "https://github.com/daikonk/mocktalk",
      info: "a basic code interpreter written in go, my first exposure to go (and TDD)",
      owner: "daikonk",
      repo: "mocktalk",
    },
  ];

  const completed = [
    {
      label: "Go Interpreter",
      link: "https://github.com/daikonk/go_interpreter",
      info: "a basic code interpreter written in go, my first exposure to go (and TDD)",
      owner: "daikonk",
      repo: "go_interpreter",
    },
  ];

  return (
    <>
      {inProgress.map((item, index) => (
        <InprogressRepo
          key={index}
          label={item.label}
          link={item.link}
          info={item.info}
          owner={item.owner}
          repo={item.repo}
        />
      ))}
      {completed.map((item, index) => (
        <CompletedRepo
          key={index}
          label={item.label}
          link={item.link}
          info={item.info}
          owner={item.owner}
          repo={item.repo}
        />
      ))}
    </>
  );
};

export default Analytics;
