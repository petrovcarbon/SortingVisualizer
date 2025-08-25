import './App.css';
import React, {Component} from 'react';
import Bar from './components/Bar';
import BubbleSort from './algorithms/BS';
import InsertionSort from './algorithms/InsertionSort';
import MergeSort from './algorithms/MergeSort';
import QuickSort from './algorithms/QuickSort';
import SelectionSort from './algorithms/SelectionSort';

class App extends Component{
  state = {
    array: [],
		arraySteps: [],
		colorKey: [],
		colorSteps: [],
    currentStep: 0,
    count: 20,
    delay: 300,
    algorithm: 'Bubble Sort',
    timeouts: [],
    algorithmTitle: '',
    hasSelectedAlgorithm: false, 
    isPlaying: false,
  };

  ALGORITHMS = {
    'Bubble Sort': BubbleSort,
    'Insertion Sort': InsertionSort,
    'Merge Sort': MergeSort,
    'Quick Sort': QuickSort,
    'Selection Sort': SelectionSort
  };

  componentDidMount(){
    this.generateRandomArray();
  }   

  generateSteps = () => {
    // let array = this.state.array.slice();
		// let steps = this.state.arraySteps.slice();
		// let colorSteps = this.state.colorSteps.slice();
    let array = this.state.array.slice();
    let steps = [array.slice()];
    let colorKey = new Array(array.length).fill(0);
    let colorSteps = [colorKey];


	  const algorithmFn = this.ALGORITHMS[this.state.algorithm];
    if (typeof algorithmFn !== "function") {
      console.error("Invalid algorithm selected:", this.state.algorithm);
      return;
    }

    algorithmFn(array, 0, steps, colorSteps);
    

    this.setState({
      arraySteps: steps,
      colorSteps: colorSteps,
      currentStep: 0,
    }); 
  };

  clearTimeouts = () => {
    this.state.timeouts.forEach((timeout)=>clearTimeout(timeout));
    this.setState({
      timeouts:[]
    });
  };

  clearColorKey = () => {
    let blankKey = new Array(this.state.count).fill(0);

    this.setState({
      colorKey: blankKey,
      colorSteps: [blankKey]
    })
  }

  generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max-min)+ min)
  };

  generateRandomArray = () => {
    this.clearTimeouts();
    this.clearColorKey();
    const count = this.state.count;
    const temp = [];
    for(let i = 0;i < count; i++){
      temp.push(this.generateRandomNumber(50,200));
    }
    this.setState({
      array: temp,
      arraySteps: [temp],
      currentStep: 0,
      algorithmTitle: '',
      hasSelectedAlgorithm: false, // ← Disable Play again
    }, ()=>{
      this.generateSteps();
    });
  };

  changeArray = (index,value) => {
    let arr=this.state.array;
    arr[index]=value;
    this.setState({
      array: arr,
      arraySteps: [arr],
      currentStep: 0
    }, () => {
      this.generateSteps();
    });
  };

  previousStep = () => {
    let currentStep = this.state.currentStep;
		if (currentStep === 0) return;
		this.clearTimeouts();
		currentStep -= 1;
		this.setState({
			array: this.state.arraySteps[currentStep],
			colorKey: this.state.colorSteps[currentStep],
			currentStep: currentStep,
		})
  };
  nextStep = () => {
    let currentStep = this.state.currentStep;

		if (currentStep >= this.state.arraySteps.length - 1) return;
    this.clearTimeouts();
    currentStep += 1;
    this.setState({
			array: this.state.arraySteps[currentStep],
			colorKey: this.state.colorSteps[currentStep],
			currentStep: currentStep,
		})
  };

  pause = () => {
    this.clearTimeouts();
    this.setState({ isPlaying: false });
  };

  changeAlgorithm = (newAlgorithm) => {
  this.setState({ algorithm: newAlgorithm, algorithmTitle: newAlgorithm,hasSelectedAlgorithm: true, currentStep: 0  }, () => {
    this.generateSteps();
    });
  };

  start = () => {
  const steps = this.state.arraySteps;
  const colorSteps = this.state.colorSteps;

  if (!steps.length) return;

  this.clearTimeouts();

  let timeouts = [];

  for (let i = 0; i < steps.length; i++) {
    const timeout = setTimeout(() => {
      this.setState({
        array: steps[i],
        colorKey: colorSteps[i],
        currentStep: i + 1,
      });
    },  this.state.delay * (i - this.state.currentStep)); // adjust delay

    timeouts.push(timeout);
  }

  this.setState({
    timeouts: timeouts,
    currentStep: 0,
    isPlaying: true,
  });
  };

 render() {
		let bars = this.state.array.map((value, index) => (
			<Bar
				key={index}
				index={index}
				length={value}
				color={this.state.colorKey[index]}
				changeArray={this.changeArray}
			/>
		));

    let playButton; 
    if (this.state.arraySteps.length === this.state.currentStep) {
      playButton= (
        <button className='controller' onClick={this.generateRandomArray}>
          <div className="reload">&nbsp;</div>
        </button>
      );
    } else if (this.state.isPlaying) {
      playButton = (
        <button className="controller" onClick={this.pause} disabled={!this.state.hasSelectedAlgorithm}>
          <div className="pause">&nbsp;</div>
        </button>
      );
    }else{
      playButton= (
        <button className='controller' onClick={this.start} disabled={!this.state.hasSelectedAlgorithm}>
          <div className="play">&nbsp;</div>
        </button>
      );
    }

    return ( 
    <div className='app'>
      <div className="algName">
        <h1>{this.state.algorithmTitle}</h1>
      </div>
      <div className="frame">
        <div className="barsDiv container card">{bars}</div>
      </div>
      <div className='control-pannel'>
        <div className='control-buttons'>
          <button className='controller' onClick={this.previousStep} disabled={!this.state.hasSelectedAlgorithm}>
            <div className="playprev">&nbsp;</div>
          </button>
          {playButton}
          <button className='controller' onClick={this.nextStep} disabled={!this.state.hasSelectedAlgorithm}>
            <div className="next">&nbsp;</div>
          </button>
        </div>
      </div>
      <div className='pannel'>
        <button className='button' onClick={()=>this.changeAlgorithm('Bubble Sort')}>Bubble Sort</button>
        <button className='button' onClick={()=>this.changeAlgorithm('Insertion Sort')}>Insertion Sort</button>
        <button className='button' onClick={()=>this.changeAlgorithm('Merge Sort')}> Merge Sort</button>
        <button className='button' onClick={()=>this.changeAlgorithm('Quick Sort')}> Quick Sort</button>
        <button className='button' onClick={()=>this.changeAlgorithm('Selection Sort')}> Selection Sort</button>
			</div>
    </div>
    );
  }
}

export default App;
