# GPhotos-EXIF-ReMerger
EXIF ReMerger for Google Photos is a specialized tool designed to re-associate EXIF metadata with images after they've been uploaded to Google Photos. This utility tackles the common issue of stripped EXIF data, such as timestamps, camera settings, and geolocation information, during the upload process to Google Photos.

## Prerequisites
- Node.js
- npm

## Installing
- Clone the repository
- Navigate to the project directory
- Run `npm install` to install dependencies

## Usage
- Update the `src` and `dest` variables in `index.js` to the source and destination directories, respectively.
- Run the script with `node index.js`.

## Functionality
The script works as follows:

- It reads the source directory and processes each file.
- If a file is a JSON file, it checks if a corresponding media file exists in the source directory.
- If a corresponding media file exists, it reads the JSON file, creates Exif data from the JSON metadata, copies the media file to the destination directory, and updates the Exif data and timestamp of the copied media file.
- If a corresponding media file does not exist, it logs an error and skips the JSON file.
- If a file is not a JSON file, it simply copies the file to the destination directory.

## Built With
- Node.js
- exiftool-vendored - A Node.js wrapper for the ExifTool command-line application.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
