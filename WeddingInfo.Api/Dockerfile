FROM microsoft/dotnet:aspnetcore-runtime
WORKDIR /app
COPY . .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet WeddingInfo.Api.dll
