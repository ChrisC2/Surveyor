# Surveyor
### Tech Stack: HTML5, CSS3, AngularJS, PassportJS, NodeJS, Express, MySQL, SequelizeJS
#### Description: 
This is a basic MVP full stack application with two user interfaces. The app allows Admin's to enter survey questions with multiple choice answers and view their survey results. 
Guests have a separate interface in which they are presented with a survey question at random upon which they can select their answer. Once answered the same Guest can no longer answer the same question.
Media queries were implemented in order to optimize the views for mobile devices.

#### Improvements to be Made Given More Time:
1. Polish the UI
2. Fix edge cases so that empty values cannot be entered
3. HighCharts Pie Graphs on survey results
4. Further Modularize Code

# Run the App:
## Install Dependencies:
```
npm install
npm install mysql

```
## Mysql Setup:
```
mysql -u root
create database Surveyor
use Surveyor
```
## Run Server:
```
node server.js
```

## Navigate the App:

### Must start as Admin:
1. Register as an Admin
2. Login with your new Admin account
3. Click 'Yes' to add a survey question
4. Add any number of possible answers to your question
5. When finished adding possible answers click "Finalize your Question" to post the question

### As Guest:
1. Register as a Guest(must be different than Admin account)
2. Login with your new Guest account
3. A random question will pop up
4. Click your answer to the question
5. Can be continued until questions are exhausted
