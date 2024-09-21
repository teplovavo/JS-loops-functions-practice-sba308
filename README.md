308 SBA Teplova



I checked if the assignment group belongs to the course. If it doesn’t, I throw an error to let the user know that the group isn’t valid for the course.

Then, I validated all the learner submissions. I made sure that for each submission, the score is a valid number and the assignment has positive possible points. If everything is fine, I log that the submission is valid. If not, I log that it’s invalid.

Next, I processed each assignment. I converted the due date to a Date object so I could work with it, and I checked if the points possible for the assignment were greater than zero. If not, I throw an error.

For each submission, I made sure it belongs to the right assignment, and then I checked if the learner is already in the result. If they aren’t, I create a new object for that learner. I also converted the submission date to a Date object and checked if the submission was late. If it was late, I deducted 10% from the score.

After that, I calculated the percentage of the score for each assignment and stored it in the learner’s data. I also updated the learner’s total points and possible points to use them later for calculating their average.
