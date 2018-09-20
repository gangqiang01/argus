package aes

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
)

var key = []byte("The_key!The_key!")

// func main() {
// 	// testAes()
// 	var s = Encrypt("test20170724xxx")
// 	fmt.Println(s)
// 	fmt.Println(Decrypt(s))
// }

// func testAes() {
// 	// AES-128。key长度：16, 24, 32 bytes 对应 AES-128, AES-192, AES-256
// 	key := []byte("The_key!The_key!")
// 	result, err := AesEncrypt([]byte("test20170724xxx"), key)
// 	if err != nil {
// 		panic(err)
// 	}
// 	fmt.Println(base64.StdEncoding.EncodeToString(result))
// 	origData, err := AesDecrypt(result, key) //origData, err := AesDecrypt(result, key)
// 	if err != nil {
// 		panic(err)
// 	}
// 	fmt.Println(string(origData))
// }

func Encrypt(str string) string {
	result, err := aesEncrypt([]byte(str), key)
	if err != nil {
		panic(err)
	}
	return base64.StdEncoding.EncodeToString(result)
}
func Decrypt(str string) string {

	input, err := base64.StdEncoding.DecodeString(str)
	if err != nil {
		panic(err)
	}
	result, err := aesDecrypt(input, key)
	if err != nil {
		panic(err)
	}
	return string(result)
}

func aesEncrypt(origData, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	blockSize := block.BlockSize()
	origData = pKCS5Padding(origData, blockSize)
	// origData = zeroPadding(origData, block.BlockSize())
	blockMode := cipher.NewCBCEncrypter(block, key[:blockSize])
	crypted := make([]byte, len(origData))
	// 根据CryptBlocks方法的说明，如下方式初始化crypted也可以
	// crypted := origData
	blockMode.CryptBlocks(crypted, origData)
	return crypted, nil
}

func aesDecrypt(crypted, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	blockSize := block.BlockSize()
	blockMode := cipher.NewCBCDecrypter(block, key[:blockSize])
	origData := make([]byte, len(crypted))
	// origData := crypted
	blockMode.CryptBlocks(origData, crypted)
	origData = pKCS5UnPadding(origData)
	// origData = zeroUnPadding(origData)
	return origData, nil
}

func zeroPadding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	padtext := bytes.Repeat([]byte{0}, padding)
	return append(ciphertext, padtext...)
}

func zeroUnPadding(origData []byte) []byte {
	length := len(origData)
	unpadding := int(origData[length-1])
	return origData[:(length - unpadding)]
}

func pKCS5Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(ciphertext, padtext...)
}

func pKCS5UnPadding(origData []byte) []byte {
	length := len(origData)
	unpadding := int(origData[length-1])
	return origData[:(length - unpadding)]
}
