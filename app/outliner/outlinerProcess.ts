process.on('message', message => {
  // const result = longComputation();
  if (process.send) {
    process.send('pong');
  }
});
