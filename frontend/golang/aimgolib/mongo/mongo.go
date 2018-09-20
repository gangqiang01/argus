package mongo

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strings"

	mgo "gopkg.in/mgo.v2"
)

var http string

func readConfig() {
	// open file
	inputFile, err := os.Open("mgoDBConfig.txt")

	if err != nil {
		fmt.Println("Open Error!")
		return
	}
	// Leave the file automatically when leaving
	defer inputFile.Close()

	inputReader := bufio.NewReader(inputFile)

	for {
		inputString, err := inputReader.ReadString('\n')
		if err == io.EOF {
			return
		}

		var value = strings.Split(inputString, "=")
		value[1] = strings.Replace(value[1], "\r", "", -1)
		value[1] = strings.Replace(value[1], "\n", "", -1)
		if value[0] == "serverip" {
			http = value[1]
		}
	}
}

func Insert(c *mgo.Collection, insert ...interface{}) (err error) {
	for i := range insert {
		fmt.Println("Person func: ", insert[i])
		err = c.Insert(insert[i])
		if err != nil {
			panic(err)
			return err
		}
	}
	return nil
}

func Select(c *mgo.Collection, query interface{}) *mgo.Query {
	return c.Find(query)
}

func Update(c *mgo.Collection, selector interface{}, update interface{}) error {
	return c.Update(selector, update)
}

func UpdateAll(c *mgo.Collection, selector interface{}, update interface{}) (*mgo.ChangeInfo, error) {
	return c.UpdateAll(selector, update)
}

func Remove(c *mgo.Collection, query interface{}) error {
	return c.Remove(query)
}

func RemoveAll(c *mgo.Collection, query interface{}) (*mgo.ChangeInfo, error) {
	return c.RemoveAll(query)
}

func CountNum(c *mgo.Collection) (int, error) {
	return c.Count()
}

func Init(database, table string) (*mgo.Session, *mgo.Collection) {
	readConfig()

	session, _ := mgo.Dial(http)
	session.SetMode(mgo.Monotonic, true)

	db := session.DB(database)
	collection := db.C(table)
	return session, collection
}
