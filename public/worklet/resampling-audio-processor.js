class ResamplingAudioProcessor extends AudioWorkletProcessor {
  inputSampleRate = null;
  outputSampleRate = null;
  inputBufferLength = 4096;
  outputBufferLength = null;
  outputBuffer = null;
  samplesPerOutputSample = null;
  outputBufferIndex = 0;
  inputSampleSum = 0;
  inputSampleCount = 0;

  constructor(options) {
    super(options);
    this.inputSampleRate = options.processorOptions.inputSampleRate;
    this.outputSampleRate = options.processorOptions.outputSampleRate;
    this.outputBufferLength = Math.ceil((this.inputBufferLength * this.outputSampleRate) / this.inputSampleRate);
    this.outputBuffer = new Int16Array(this.outputBufferLength);
    this.samplesPerOutputSample = Math.ceil(this.inputSampleRate / this.outputSampleRate);
  }

  process(inputs, outputs, parameters) {
    const inputData = inputs[0][0];
    const outputData = this.outputBuffer;

    if (!inputData) return;

    for (let i = 0; i < inputData.length; i++) {
      this.inputSampleSum += inputData[i];
      this.inputSampleCount++;

      if (this.inputSampleCount === this.samplesPerOutputSample) {
        // calculate average of input samples
        const average = this.inputSampleSum / this.samplesPerOutputSample;

        // write output sample to buffer
        outputData[this.outputBufferIndex] = Math.floor(32767 * average);

        // reset input sample count and sum
        this.inputSampleCount = 0;
        this.inputSampleSum = 0;

        // increment output buffer index
        this.outputBufferIndex++;
      }

      if (this.outputBufferIndex === this.outputBufferLength) {
        // output buffer is full, send it to main thread
        this.port.postMessage(this.outputBuffer);

        // reset output buffer index and clear buffer
        this.outputBufferIndex = 0;
        this.outputBuffer.fill(0);
      }
    }

    return true;
  }
}

registerProcessor('resampling-audio-processor', ResamplingAudioProcessor);
