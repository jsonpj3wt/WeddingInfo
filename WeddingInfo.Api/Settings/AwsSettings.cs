using System;
namespace WeddingInfo.Api.Settings
{
    public class AwsSettings
    {
		public bool FakeS3 { get; set; }
		public string AccessKey { get; set; }
		public string Bucket { get; set; }
		public string AssetPath { get; set; }
		public string UploadPath { get; set; }
		public string SecretKey { get; set; }
    }
}
