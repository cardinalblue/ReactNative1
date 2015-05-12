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
} = React;

var Boxes = [
	{ color: 'pink', x: 10, y: 10 },
	{ color: 'blue', x: 30, y: 30 },
];

// ---------------------------------------------------------------------------
var ReactNative1 = React.createClass({
	getInitialState: function() {
		return {
			boxes: Boxes,
		};		
	},
	componentWillMount: function() {
		
	},
	_onPressAddButton: function() {
		console.log('>>>>>>>>>> _onPressAddButton ');
		Boxes.push({ color: 'red', x: 10, y: 10 });
		this.setState({ boxes: Boxes });
	},
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
				<Text>
					Hola Mundo!
				</Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
				<View style={styles.c1}>
					<View style={styles.b1}><Text>1</Text></View>
					<View style={styles.b2}><Text>2</Text></View>
					<View style={styles.b3}><Text>3</Text></View>
				</View>
				<View style={styles.c2}>
					{ 
						this.state.boxes.map(box => {
							return (<MovableBox box={ box } />)
						}) 
					}
				</View>
				<TouchableHighlight style={ styles.addButton }
														onPress={ this._onPressAddButton } >
				  <Text style={ styles.addButtonText }>+</Text>
				</TouchableHighlight>
      </View>
    );
  }
});

// ---------------------------------------------------------------------------
var MovableBox = React.createClass({
	componentWillMount: function() {
		
	  this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: 			 (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: 				 (evt, gestureState) => true,
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

				console.log('>>>>>>> onPanResponderMove', this.props.box);
				
				this.props.box.x = this._origX + gestureState.dx;
				this.props.box.y = this._origY + gestureState.dy;
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
	render: function() {
		console.log('MovableBox');
		var box = this.props.box;
		return (
		  <View style={ [ 
						styles.box, 
						{ 
							backgroundColor: box.color,
							left: 					 box.x,	
							top: 						 box.y,
						} 
						] } 
						{...this._panResponder.panHandlers} />	
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
  welcome: {
    fontSize: 20,
    // textAlign: 'center',
    // margin: 10,
  },
  instructions: {
    // textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
	
	// ---------------------------------------------
	c1: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'purple',
	},
	b1: { flex: 1, backgroundColor: 'red', 	 margin: 10, },
	b2: { flex: 1, backgroundColor: 'green', margin: 10, },
	b3: { flex: 1, backgroundColor: 'blue',  margin: 10, },
	
	// ---------------------------------------------
	c2: {
		flex: 1,
		// height: 200,
		// width:  200,
		backgroundColor: 'yellow'
	},
	box: {
		position: 'absolute',
		height: 40,
		width: 40,

		shadowColor: 'black',
		shadowRadius: 2,
		shadowOffset: { width: 3, height: 3 },
		shadowOpacity: 0.5,

		borderWidth: 2,
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
