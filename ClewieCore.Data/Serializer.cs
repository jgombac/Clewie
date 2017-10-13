using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace ClewieCore.Data
{
    public static class Serializer
    {

        public static string Serialize<T>(this T obj)
        {
            if (obj == null) return null;

            BinaryFormatter bf = new BinaryFormatter();
            using (MemoryStream ms = new MemoryStream())
            {
                bf.Serialize(ms, obj);
                return UTF8BytesToString(ms.ToArray());
            }
        }

        public static T Deserialize<T>(string str)
        {
            BinaryFormatter bf = new BinaryFormatter();
            using (MemoryStream ms = new MemoryStream(StringToUTF8Bytes(str)))
            {
                return (T)bf.Deserialize(ms);
            }
        }

        private static string UTF8BytesToString(byte[] bytes)
        {
            return new ASCIIEncoding().GetString(bytes);//UTF8Encoding().GetString(bytes);
        }

        private static byte[] StringToUTF8Bytes(string str)
        {
            return new ASCIIEncoding().GetBytes(str);   //.GetBytes(str);
        }

    }
}
