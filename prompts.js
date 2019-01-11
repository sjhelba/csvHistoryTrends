const readline = require('readline');

const createNewInterface = () => readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const askQuestion = async (question, answers) => {
  return new Promise((resolve, reject) => {
    const readlineInterface = createNewInterface();
    readlineInterface.question(question, answer => {
      answers.push(answer);
      resolve(readlineInterface);
      reject('question rejected')
    });
  });
};

const ask = arrayOfQs => {
  return new Promise(async (resolve, reject) => {
    const answers = [];
    for(let i = 0; i < arrayOfQs.length; i++) {
      const rlInterface = await askQuestion(arrayOfQs[i], answers);
      rlInterface.close()
    }
    resolve(answers);
    reject('ask rejected');
  })
};


module.exports = {
    prompt: ask 
}

