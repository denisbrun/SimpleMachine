// Declaring constants that link to elements in Document
const runTrainingButton = document.getElementById('runTrainingButton');
const resultDiv = document.getElementById('output');
const slopeInput = document.getElementById('slope');
const offsetInput = document.getElementById('offset');

// Asynchronus function that trains a ML model
async function run() {
  resultDiv.className = '';    
  resultDiv.innerText = `Training...`;
  resultDiv.style.visibility = 'visible';
  
  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training. (y = 2x + 1)
  const array = [-5, -1, 0, 1, 2, 3, 4, 10,25];
  let length = array.length;
  const xs = tf.tensor2d(array, [length, 1]);

  const array2 = array.map(function(item){
    return (item*Number(slopeInput.value))+(Number(offsetInput.value));
  })
  
  
  const ys = tf.tensor2d(array2, [length, 1]);

  // Train the model using the data.
  await model.fit(xs, ys, {epochs: 100});

  // Use the model to do inference on a data point the model hasn't seen.
  // Should print approximately 39.
  resultDiv.innerText = `Using machine learning, the prediction for an input of 20 is ${model.predict(tf.tensor2d([20], [1, 1])).dataSync()}`;

}


runTrainingButton.addEventListener('click', checkIfCanTrain)

function checkIfCanTrain() {
  if(offsetInput.value === '' || slopeInput.value === '') {
    showErrorMessage();
    setTimeout(clearErrorMessage,3000);
  } else {    
    
    console.log(`y = ${slopeInput.value}x + ${offsetInput.value}`);
    
    run();
  }
}

function showErrorMessage() {
  resultDiv.style.visibility = 'visible';
  resultDiv.className = 'alert';
  resultDiv.innerText = `Enter values for slope and offset before training neural network`;
  // console.log("enter data before training");
}

function clearErrorMessage() {
  resultDiv.style.visibility = 'hidden';
  resultDiv.className = '';  
}


