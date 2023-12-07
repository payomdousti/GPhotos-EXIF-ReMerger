import fs from 'fs';
import path from 'path';
import { ExifTool } from 'exiftool-vendored';

const src = '/Users/payomdousti/Documents/Archives/gphotos/unzip_test';
const dest = '/Users/payomdousti/Documents/Archives/gphotos/unzip_mod';

async function processFolder(sourceFolderPath, destinationFolderPath) {
    const exiftool = new ExifTool();

    try {
        const files = await fs.promises.readdir(sourceFolderPath);
        await Promise.all(
            files.map(
                fileName => processFile(exiftool, sourceFolderPath, destinationFolderPath, fileName)
            )
        );
    } catch (error) {
        console.error(`Error processing folder: ${error.message}`);
    } finally {
        console.error(`Done`);
        exiftool.end();
    }
}

async function processFile(exiftool, sourceFolderPath, destinationFolderPath, fileName) {
    console.log(`Processing file: ${fileName}`);
    try {
        if (path.extname(fileName) === '.json') {
            const jsonFilePath = path.join(sourceFolderPath, fileName);
            const mediaFileName = path.basename(fileName, '.json');
            const mediaFilePath = path.join(sourceFolderPath, mediaFileName);
            const outputPath = path.join(destinationFolderPath, mediaFileName);

            if (!fs.existsSync(mediaFilePath)) {
                console.error(`Media file does not exist: ${mediaFilePath}`);
                return;
            }

            const metadataObject = await readMetadata(jsonFilePath);
            const exifData = createExifData(metadataObject);

            await copyFileWithStreams(mediaFilePath, outputPath);
            await writeExifData(exiftool, outputPath, exifData);
            await updateFileTimestamp(outputPath, metadataObject.photoTakenTime.timestamp);
        }
    } catch (error) {
        console.error(`Error processing file ${fileName}: ${error.message}`);
    }
}

async function readMetadata(jsonFilePath) {
    console.log(`Reading metadata from: ${jsonFilePath}`);
    const metadata = await fs.promises.readFile(jsonFilePath, 'utf8');
    return JSON.parse(metadata);
}

function createExifData(metadataObject) {
    console.log(`Creating Exif data`);
    return {
        Title: metadataObject.title,
        Description: metadataObject.description,
        DateTimeOriginal: new Date(metadataObject.photoTakenTime.timestamp * 1000).toISOString().substring(0, 19),
        GPSLatitude: metadataObject.geoData.latitude,
        GPSLongitude: metadataObject.geoData.longitude,
        GPSAltitude: metadataObject.geoData.altitude,
    };
}

async function copyFileWithStreams(sourcePath, destinationPath) {
    console.log(`Copying file from ${sourcePath} to ${destinationPath}`);
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destinationPath);

    readStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

async function writeExifData(exiftool, filePath, exifData) {
    console.log(`Writing Exif data to: ${filePath}`);
    await exiftool.write(filePath, exifData);
}

async function updateFileTimestamp(filePath, timestamp) {
    console.log(`Updating file timestamp for: ${filePath}`);
    await fs.promises.utimes(filePath, new Date(), new Date(timestamp * 1000));
}

processFolder(src, dest);