FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /usr/src/app
COPY ./*.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/out ./
ENTRYPOINT ["dotnet", "Dashboard.dll"]