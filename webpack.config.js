const path = require('path');

module.exports = {
  entry: {
    dayplan : './src/dayplan.js',
    homepage:'./src/homepage.js',
    calender:'./src/calender.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
  },
  devtool: 'source-map',
  watch: true 
};
 



