import React, { Component } from "react";
import { StyleSheet, View, Button, Text, ScrollView  } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";

export default class StockChart extends Component {
  constructor(props) {
    super(props);
  }
  
  /*
  onRef = ref => {
    if (ref) {
      this.chart = ref;
      //console.log(this.chart.getOption());
    }
  };    
  */
  //initChart = () => {
    calculateMA(dayCount, dataClose) {
      let result = [];
      //console.log(dataClose.length);
      for (let i = 0, len = dataClose.length; i < len; i++) {
          if (i < dayCount) {
              result.push('-');
              continue;
          }
          let sum = 0;
          for (let j = 0; j < dayCount; j++) {
              sum += dataClose[i - j];
          }
          //console.log(sum);
          result.push((sum / dayCount).toFixed(2));
      }
      
      return result;
    }

    render() { 
    //let stockData = data.slice(-30);
    let data = this.props.data;
    let name = this.props.name + "("+this.props.info.companyName+")";
    let stockData = this.props.data;

    //this.setState({stockInfo: this.props.info});

    let dates = [];
    let values = [];

    let dataLow = [];
    let dataHigh = [];
    let dataClose = [];

    for(let i=0; i < data.length; i++)
    {
      dataHigh.push(data[i].high);
      dataLow.push(data[i].low);
      dataClose.push(data[i].close);
    }

    if (data) {
      stockData.map((data) => dates.push(data["date"]));
      //console.log(dates);

      stockData.map((item) =>    
        values.push([item["open"], item["close"], item["low"], item["high"]])
      );
      //console.log(values);
    }

    const option = {
      
      title: {
        text: name,
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          lineStyle: {
            color: "#376df4",
            width: 1,
            opacity: 1,
          },
        },
      },   

      legend: {
          top: 30,
          data: ['Daily', 'MA5', 'MA10', 'MA20']
      },

      grid: {
        left: '15%',
        right: '10%',
        bottom: '15%'
      },

      xAxis: {
        type: "category",
        data: dates,
        //axisLine: { lineStyle: { color: "white" } },
        scale: true,
      },
      yAxis: [
        {
          type: "value",
          min: Math.min(...dataLow),
          max: Math.max(...dataHigh),
          //axisLine: {lineStyle: { color: "white" } },
        },
        {
          scale: false,
          splitLine: { show: false },
        },      
      ],

      dataZoom: [
          {
              type: 'inside',
              start: 50,
              end: 100
          },
          {
              show: true,
              type: 'slider',
              top: '93%',
              start: 50,
              end: 100
          }
      ],

      series: [
        
        {
          type: "candlestick",
          name: "Daily",
          data: values,
          itemStyle: {
            normal: {
              color: "#CF0101",
              color0: "#16C4E8",
              borderColor: "#CF0101",
              borderColor0: "#16C4E8",
            },
          },
        },

        {
          name: 'MA5',
          type: 'line',
          data: this.calculateMA(5, dataClose),
          smooth: true,
          lineStyle: {
              opacity: 0.5,
              //color: "#CF0101",
          }
        },

        {
          name: 'MA10',
          type: 'line',
          data:  this.calculateMA(10, dataClose),
          smooth: true,
          lineStyle: {
              opacity: 0.5,
              //color: "#8F3A84",
          }
        },

        {
          name: 'MA20',
          type: 'line',
          data:  this.calculateMA(20, dataClose),
          smooth: true,
          lineStyle: {
              opacity: 0.5
          }
        },
      ]
    };

    //this.chart.setOption(option);
    //this.chart.getOption(option => {});
    //console.log(this);

  //}

  
    //console.log("this");
    //this.initChart();
    return (
      <View style={styles.chartContainer}>
        {/*<Button title="Update Chart" onPress={this.initChart} />*/}
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor:'#E5E7E7', padding:5}}>
          <Text style={[styles.price, (parseFloat(this.props.info["change"]) > 0 ? styles.price : styles.priceBlue)]}> {parseFloat(this.props.info["latestPrice"]) > 0 ? "$"+this.props.info["latestPrice"] : this.props.info["latestPrice"]}</Text> 
          <Text style={[styles.priceChange, (parseFloat(this.props.info["change"]) > 0 ? styles.priceChange : styles.priceChangeBlue)]}>{parseFloat(this.props.info["change"]) > 0 ? "+" + this.props.info["change"] : this.props.info["change"]}</Text> 
          <Text style={styles.lastTrade}> Last Trade: {this.props.info["latestTime"]}</Text> 
          <Text style={[styles.latestPricePerc, (parseFloat(this.props.info["change"]) > 0 ? styles.latestPricePerc : styles.latestPricePercBlue)]}> {parseFloat(this.props.info["changePercent"]) > 0 ? "+" + this.props.info["changePercent"]+"%" : this.props.info["changePercent"]+"%" }</Text> 
        </View>
        <View style={{flex: 6}}>
          <ECharts
            option={option}
            //ref={this.onRef}
            backgroundColor="#E5E7E7"
          />
        </View>
       
        <View style={{flex: 3, flexDirection: 'row', flexWrap: 'wrap', padding:5, backgroundColor:'#E5E7E7'}}>
          
          <Text style={styles.infoContainer}> High</Text>           
          <Text style={styles.dataContainer}>{this.props.info["high"]}   </Text> 
          <Text style={styles.infoContainer}>   52wk High</Text>           
          <Text style={styles.dataContainer}>{this.props.info["week52High"]}</Text> 

          <Text style={styles.infoContainer}> Low</Text>           
          <Text style={styles.dataContainer}>{this.props.info["low"]}   </Text> 
          <Text style={styles.infoContainer}>   52wk Low</Text>           
          <Text style={styles.dataContainer}>{this.props.info["week52Low"]}</Text> 

          <Text style={styles.infoContainer}> Open</Text>           
          <Text style={styles.dataContainer}>{this.props.info["open"]}   </Text> 
          <Text style={styles.infoContainer}>   Close</Text>           
          <Text style={styles.dataContainer}>{this.props.info["close"]}</Text> 

          <Text style={styles.infoContainer}> Volume</Text>   
          <Text style={styles.dataContainer}>{parseInt(this.props.info["volume"]) > 0 ? this.props.info["volume"]+"M" : this.props.info["volume"]}   </Text> 
          <Text style={styles.infoContainer}>   Total Vol</Text>           
          <Text style={styles.dataContainer}>{parseInt(this.props.info["avgTotalVolume"]) > 0 ? this.props.info["avgTotalVolume"]+"M" : this.props.info["avgTotalVolume"]}</Text>

          <Text style={styles.infoContainer}> P/E</Text>    
          <Text style={styles.dataContainer}>{this.props.info["peRatio"]}   </Text> 
          <Text style={styles.infoContainer}>   Last Price</Text>           
          <Text style={styles.dataContainer}>{this.props.info["latestPrice"]}</Text> 

          <Text style={styles.infoContainer}> Delayed price</Text>           
          <Text style={styles.dataContainer}>{this.props.info["delayedPrice"]}   </Text> 
          <Text style={styles.infoContainer}>   Extened Price</Text>           
          <Text style={styles.dataContainer}>{this.props.info["extendedPrice"]}</Text> 
          
        </View>
      
      </View>     
    );
  }
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1
  },
  price : {
    fontSize: 25,    
    backgroundColor: '#E5E7E7',
    width: '50%',
    height: 30,
    fontWeight: "bold",
    color: "#CF0101",
  },

  priceBlue : {
    fontSize: 25,    
    backgroundColor: '#E5E7E7',
    width: '50%',
    height: 30,
    fontWeight: "bold",
    color: "#16C4E8",
  },

  priceChange : {
    fontSize: 25,    
    backgroundColor: '#E5E7E7',
    width: '50%',
    height: 30,
    textAlign: 'right', 
    alignSelf: 'stretch',
    fontWeight: "bold",
    color: "#CF0101",
  },

  priceChangeBlue : {
    fontSize: 25,    
    backgroundColor: '#E5E7E7',
    width: '50%',
    height: 30,
    textAlign: 'right', 
    alignSelf: 'stretch',
    fontWeight: "bold",
    color: "#16C4E8",
  },

  lastTrade : {
    fontSize: 12,    
    backgroundColor: '#E5E7E7',
    width: '50%',
    height: 30,
  },

  latestPricePerc : {
    fontSize: 12,    
    backgroundColor: '#E5E7E7',
    width: '50%',
    height: 30,
    textAlign: 'right', 
    alignSelf: 'stretch',
    color: "#CF0101",
  },

  latestPricePercBlue : {
    fontSize: 12,    
    backgroundColor: '#E5E7E7',
    width: '50%',
    height: 30,
    textAlign: 'right', 
    alignSelf: 'stretch',
    color: "#16C4E8",
  },

  infoContainer: {
    fontSize: 12,    
    backgroundColor: '#E5E7E7',
    width: '25%',
    height: 30,
  },
  dataContainer: {
    fontSize: 12,
    backgroundColor: '#E5E7E7',
    width: '25%',
    height: 30,
    textAlign: 'right', 
    alignSelf: 'stretch',
    fontWeight: "bold"
  }
});

