using System;
namespace WeddingInfo.Api.Settings
{
	public class TokenSettings
    {
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string TokenPath { get; set; }
        public string CookieName { get; set; }
    }
}
