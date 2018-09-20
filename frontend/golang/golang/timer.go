package main

import (
	"fmt"
	"time"
	"os"
	"strconv"
)



func main() {
	
  timer()
	
	
	
}

func timer(){
	t := time.Now()
    sec := t.Second()
	fmt.Println(t.Unix())
	timeChan := time.NewTimer(time.Second * time.Duration(59-sec) ).C
	tickChan := time.NewTicker(time.Second * 60)
	doneChan := false
	for {
        select {
			case <- timeChan:
				tickChan = time.NewTicker(time.Second * 60)
				doneChan = true
				t := time.Now()
				fmt.Println(t.Unix())
			case <- tickChan.C:
				if doneChan{
					fmt.Println("success")
					t := time.Now()
					sec := t.Second()
					fmt.Println(sec)
				}
				
		
		}
    }
	
}

func timestamp(){
	 unixTimeStamp := "1432572732"

         unixIntValue, err := strconv.ParseInt(unixTimeStamp, 10, 64)

         if err != nil {
                 fmt.Println(err)
                 os.Exit(1)
         }

        timeStamp := time.Unix(unixIntValue, 0)
        sec := timeStamp.Second()
		fmt.Println(sec)
}