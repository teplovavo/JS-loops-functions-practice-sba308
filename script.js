console.log("Start")

// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,   // the ID of the course the assignment group belongs to
    group_weight: 25,    // the percentage weight of the entire assignment group
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",   // the due date for the assignment
        points_possible: 50    // the maximum points possible for the assignment
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  function getLearnerData(course, ag, submissions) {
    // here, we would process this data to achieve the desired result.
    const result = [
      {
        id: 125,
        avg: 0.985, // (47 + 150) / (50 + 150)
        1: 0.94, // 47 / 50
        2: 1.0 // 150 / 150
      },
      {
        id: 132,
        avg: 0.82, // (39 + 125) / (50 + 150)
        1: 0.78, // 39 / 50
        2: 0.833 // late: (140 - 15) / 150
      }
    ];
  
    return result;
  }
  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  console.log(result);


  //Your goal is to analyze and transform this data such that the output of your program is an array of objects, each containing the following information in the following format:
    // the ID of the learner for which this data has been collected
    //id number,
    // the learner’s total, weighted average, in which assignments
    // with more points_possible should be counted for more
    // e.g. a learner with 50/100 on one assignment and 190/200 on another
    // would have a weighted average score of 240/300 = 80%.
    //avg number,
    // each assignment should have a key with its ID,
    // and the value associated with it should be the percentage that
    // the learner scored on the assignment (submission.score / points_possible)
   // assignment_id number 
    // if an assignment is not yet due, it should not be included in either
    // the average or the keyed dictionary of scores

////////////////////////////////////////MY CODE///////////////////////////////////////////

//If an AssignmentGroup does not belong to its course
function GroupBelongsToCourse (CourseInfo, AssignmentGroup) {
    if (CourseInfo.id !== AssignmentGroup.course_id) {
        throw new Error ("Error: This assignment Group does NOT belong to the Course!");
    }
    return true; // if the group belongs to the course
}
try {
    const groupValidationResult = GroupBelongsToCourse(CourseInfo, AssignmentGroup);
    console.log("Does this group belongs to course? - ", groupValidationResult);
} catch (Error) {
    console.error(Error.message);
}

// Check if a learner's submission is valid.
function validSubmission(submission, assignment) {
    const finalScore = submission.submission.score;
    const pointsPossible = assignment.points_possible;
 const isValid = pointsPossible > 0 && typeof finalScore === "number" && !isNaN(finalScore);
 return isValid; 
}
function validateSubmissions(submissions, assignments) {
    submissions.forEach(submission => {
        const assignment = assignments.find(a => a.id === submission.assignment_id);
        const isValid = validSubmission(submission, assignment);
        console.log(`Submission for learner ${submission.learner_id} on assignment ${submission.assignment_id} is ${isValid ? 'valid' : 'not valid'}.`);
    });
}
validateSubmissions(LearnerSubmissions, AssignmentGroup.assignments);


