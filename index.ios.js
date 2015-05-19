/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  TouchableHighlight,
  Image,
  CameraRoll,
} = React;

// ---------------------------------------------------------------------------
// "MODELS"

class Box {
  static nextBox(color, width, height) {
    var b = new this();
    b.color = this.nextColor();
    b.id    = this.nextId();
    return b;
  }
  static nextColor() {
    var color = this.colors.shift();
    this.colors.push(color);
    return color;
  }
  static nextId() {
    return this.id++;
  }

}
Box.all    = [];
Box.colors = [ 'gray', 'purple', 'orange', 'green', 'magenta', 'cyan', 'red', 'white' ];
Box.id     = 1;


// ---------------------------------------------------------------------------
// COMPONENTS

class ReactNative1 extends React.Component {
  constructor(props) {
    this.state = { boxes: Box.all };
  }
  componentWillMount() {
    
  }
  _onPressAddButton() {
    console.log('>>>>>>>>>>', this);
    this.getNewImage((uri, width, height) => {
      console.log('>>>>>>>>>', uri, width, height);
      var ratio = width / height;
      var W = 100;
      var newBox = Box.nextBox();
      console.log('>>>>>>>>>>>>> newBox', newBox);
      newBox.x         = Math.random() * 100;
      newBox.y         = Math.random() * 100;
      newBox.sourceURL = uri;
      newBox.width     = W;
      newBox.height    = W / ratio;

      console.log('>>>>>>>>>>>', newBox);
      Box.all.push(newBox);
      this.setState({ boxes: Box.all });
    });
  }
  getNewImage(callback) {
    if (this._photos) {
      var image = this.random(this._photos.edges).node.image;
      callback(image.uri, image.width, image.height);
    }
    else {
      CameraRoll.getPhotos({ first: 100 }, 
        (photos) => {
          console.log('photos: ', photos, photos.edges[0]);     
          this._photos = photos;
          this.getNewImage(callback);  // Recursive call 
        },
        (error) => {
          console.log('error: ', error);
        
        }
      );
    }
  }
  random(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  render() {
    return (
      <View style={styles.container} >
        <View style={styles.c2}>
          { 
            this.state.boxes.map(box => {
              return (<MovableBox key={ box.id } box={ box } />)
            }) 
          }
        </View>
        <TouchableHighlight style={ styles.addButton }
                            onPress={ () => this._onPressAddButton() } >
          <Text style={ styles.addButtonText }>+</Text>
        </TouchableHighlight>
      </View>
    );
  }
};


// ---------------------------------------------------------------------------
var MovableBox = React.createClass({
  componentWillMount: function() {
    
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder:        (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder:         (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture:  (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now
        
        this._origX  = this.props.box.x;
        this._origY  = this.props.box.y;
        
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}

        var box = this.props.box;
        box.x = this._origX + gestureState.dx;
        box.y = this._origY + gestureState.dy;
        this.forceUpdate();

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },    
    });
  },
  onLoadingFinish: function(a, b, c) {
    console.log('>>>>>>>>>>>>>>>>>> onLoadingFinish event', a, b, c);
    var image = this.refs.image;
    if (image) {
      console.log('>>>>>>>>>>>>>>>>>> onLoadingFinish image', image, image.props, image.image);
    }
  },
  render: function() {
    var box = this.props.box;
    return (
      <View style={ [ 
            styles.box, 
            { 
              backgroundColor: box.color,
              left:            box.x, 
              top:             box.y,
            } 
            ] } 
            {...this._panResponder.panHandlers} >
        <Image ref='image' 
               source={ { uri: box.sourceURL } }
               style={ { 
                 width: box.width, 
                 height: box.height, 
                 resizeMode: 'cover' 
               }}
               onLoadingFinish={ this.onLoadingFinish() }/>
      </View> 
    );
  }
  
});

// ---------------------------------------------------------------------------
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ccf',
  },
  // ---------------------------------------------
  c2: {
    flex: 3,
    backgroundColor: 'yellow'
  },
  box: {
    position: 'absolute',

    shadowColor: 'black',
    shadowRadius: 2,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,

    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#333',
  },
  addButton: {
  },
  addButtonText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 25,
    margin: 10,
  }
});

// ---------------------------------------------------------------------------
AppRegistry.registerComponent('ReactNative1', () => ReactNative1);
