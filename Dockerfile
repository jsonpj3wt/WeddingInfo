# Stage 1
FROM microsoft/dotnet:sdk AS build-env
WORKDIR /source

# caches restore result by copying csproj file separately
COPY . .
RUN dotnet restore

# copies the rest of your code
RUN dotnet publish WeddingInfo.Api --output /app/ --configuration Release

# Stage 2
FROM microsoft/dotnet:aspnetcore-runtime
WORKDIR /app

COPY --from=build-env /app .
ENTRYPOINT ["dotnet", "CodeChowder.CSMS.API.dll"]