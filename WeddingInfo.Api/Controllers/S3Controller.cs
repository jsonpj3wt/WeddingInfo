using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Amazon;
using Amazon.CognitoIdentity;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WeddingInfo.Api.Helpers;
using WeddingInfo.Api.Security;
using WeddingInfo.Api.Settings;

namespace WeddingInfo.Api.Controllers
{
	[Route("api/uploads")]
	public class S3Controller : Controller
    {
		private readonly IHostingEnvironment _hostingEnvironment;

		private readonly string _awsAccessKey;
		private readonly string _awsSecretKey;
		private readonly string _bucket;
		private readonly string _assetPath;
		private readonly string _uploadPath;
		private readonly bool _fakeS3;
		private readonly string _basePath;
		public S3Controller(
			IOptions<AwsSettings> awsSettings,
			IHostingEnvironment hostingEnvironment
		)
		{
			_hostingEnvironment = hostingEnvironment;
			AwsSettings settings = awsSettings.Value;
			_fakeS3 = settings.FakeS3;
			_bucket = settings.Bucket;
			_awsAccessKey = settings.AccessKey;
			_awsSecretKey = settings.SecretKey;
			_assetPath = settings.AssetPath;
			_uploadPath = settings.UploadPath;

			if (_fakeS3) {
				_basePath = _hostingEnvironment.ContentRootPath + Path.DirectorySeparatorChar;
			}
		}

		[HttpGet("{limit}/{lastPull?}")]
		[ClaimRequirement("UserId", "{UserId}")]
		public async Task<IActionResult> GetImages(int limit, string lastPull = null) {
			try
			{
				List<string> urls = new List<string>();
				if (!_fakeS3)
				{               
					using (var s3Client = new AmazonS3Client(_awsAccessKey, _awsSecretKey, RegionEndpoint.USEast1))
					{
						if (!(await AmazonS3Util.DoesS3BucketExistAsync(s3Client, _bucket)))
						{
							return BadRequest();
						}
						ListObjectsV2Request listRequest = new ListObjectsV2Request
						{
							BucketName = _bucket,
							StartAfter = string.IsNullOrEmpty(lastPull) ? null : lastPull,
							MaxKeys = limit

						};
						var listResponse = await s3Client.ListObjectsV2Async(listRequest);
						foreach (S3Object obj in listResponse.S3Objects)
						{
                            string extension = Path.GetExtension(obj.Key);
                            if (!string.IsNullOrWhiteSpace(extension) && obj.Key.StartsWith(_uploadPath, StringComparison.CurrentCulture))
                            {
                                urls.Add($"https://s3.amazonaws.com/{_bucket}/{obj.Key}");
                            }
						}
					}
				}
				else {
					if (Directory.Exists($"{_basePath}Uploads"))
                    {
						string[] files = Directory.GetFiles($"{_basePath}Uploads");
                        if (files.Length > 0)
                        {
							foreach (var file in files)
							{
								string filename = Path.GetFileName(file);
								string url = ConvertPathToUrl(HttpContext, $"Uploads{Path.DirectorySeparatorChar}{filename}");
								urls.Add(url);
							}
                        }
                    }               
				}
				return Ok(urls);
			}
			catch (AmazonS3Exception exception) {
				return BadRequest();
			}
		}

        [HttpPost]
		[ClaimRequirement("UserId", "{UserId}")]
		public async Task<IActionResult> PostImages() {
			try {
				List<string> urls = new List<string>();
				List<IFormFile> files = Request.Form.Files.ToList();
				if (!_fakeS3)
				{
					using (var s3Client = new AmazonS3Client(_awsAccessKey, _awsSecretKey, RegionEndpoint.USEast1))
					{
						foreach (var formFile in files)
						{
							if (formFile.Length > 0 && Extension.IsImage(formFile.OpenReadStream()))
							{
								PutObjectRequest request = new PutObjectRequest()
								{
									BucketName = _bucket,
									Key = $"{_uploadPath}{formFile.FileName}",
									InputStream = formFile.OpenReadStream(),
									CannedACL = S3CannedACL.PublicRead
								};

								PutObjectResponse response = await s3Client.PutObjectAsync(request);
								if (response.HttpStatusCode != HttpStatusCode.OK)
								{
									return BadRequest();
								}
                                urls.Add($"https://s3.amazonaws.com/{_bucket}/{request.Key}");
							}
						}
					}
				}
				else {
					foreach (var formFile in files) {
						string path = $"{_basePath}{Path.DirectorySeparatorChar}Uploads{Path.DirectorySeparatorChar}{formFile.FileName}";

						if (System.IO.File.Exists(path)) {
							System.IO.File.Delete(path);
						}

						using (var stream = new FileStream(path, FileMode.Create)) {
							await formFile.CopyToAsync(stream);
						}
						string url = ConvertPathToUrl(HttpContext, $"Uploads{Path.DirectorySeparatorChar}{formFile.FileName}");
                        urls.Add(url);

					}
				}
				return Ok(urls);
			}
			catch (AmazonS3Exception exception) {
				return BadRequest();
			}
		}

		[HttpPost("home")]
        [ClaimRequirement("UserId", "{UserId}")]
        public async Task<IActionResult> PostHomeImage()
        {
			try
            {
                List<string> urls = new List<string>();
                List<IFormFile> files = Request.Form.Files.ToList();
                if (!_fakeS3)
                {
                    using (var s3Client = new AmazonS3Client(_awsAccessKey, _awsSecretKey, RegionEndpoint.USEast1))
                    {
                        foreach (var formFile in files)
                        {
                            if (formFile.Length > 0 && Extension.IsImage(formFile.OpenReadStream()))
                            {
                                PutObjectRequest request = new PutObjectRequest()
                                {
                                    BucketName = _bucket,
                                    Key = $"{_uploadPath}{formFile.FileName}",
                                    InputStream = formFile.OpenReadStream(),
                                    CannedACL = S3CannedACL.PublicRead
                                };

                                PutObjectResponse response = await s3Client.PutObjectAsync(request);
                                if (response.HttpStatusCode != HttpStatusCode.OK)
                                {
                                    return BadRequest();
                                }
                                urls.Add($"https://s3.amazonaws.com/{_bucket}/{request.Key}");
                            }
                        }
                    }
                }
                else
                {
                    foreach (var formFile in files)
                    {
                        string path = $"{_basePath}{Path.DirectorySeparatorChar}Home_Images{Path.DirectorySeparatorChar}{formFile.FileName}";

                        if (System.IO.File.Exists(path))
                        {
                            System.IO.File.Delete(path);
                        }

                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);
                        }
						string url = ConvertPathToUrl(HttpContext, $"Home_Images{Path.DirectorySeparatorChar}{formFile.FileName}");
                        urls.Add(url);

                    }
                }
                return Ok(urls);
            }
            catch (AmazonS3Exception exception)
            {
                return BadRequest();
            }
        }

		private string ConvertPathToUrl(HttpContext httpContext, string imageName)
        {
            return $"{httpContext.Request.Scheme}://{httpContext.Request.Host}{httpContext.Request.PathBase}/{imageName}";

        }
    }   
}