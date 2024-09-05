document.getElementById('upload-btn').addEventListener('click', async function (e) {
    e.preventDefault();


    const fileInput = document.getElementById('audioFile');
    const file = fileInput.files[0];
    console.log(file)
    const trackName = document.getElementById('track-name').value;
    console.log(trackName)
    const authorName = document.getElementById('author-name').value;
    console.log(authorName)


    // Validate inputs
    if (file.length === 0) {
        alert('Please select one MP3 file.');
        return;
    }

    if (file.length > 5) {
        alert('You can upload a maximum of 5 files.');
        return;
    }

    if (!trackName || !authorName) {
        alert('Please enter both track name and author name.');
        return;
    }

    // Check that all files are MP3
    if (file.type !== 'audio/mpeg' && file.type !== 'audio/mp3') {
        alert('All files must be MP3 audio files.');
        return;
    }


    // Create a FormData object
    const formData = new FormData();

    // Append files to FormData // 'files' is the key expected by backend
    formData.append('file', file);

    // Append other data    
    formData.append('track_name', trackName);
    formData.append('author_name', authorName);

    // To verify FormData content
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }


    try {
        // Send the data to the backend using fetch
        const response = await fetch('http://127.0.0.1:8000/upload', {
            method: 'POST',
            body: formData,
            // No need to set Content-Type header; fetch sets it automatically for FormData
        })
        const responseData = await response.json();
        if (response.ok) {
            alert('File uploaded successfully!');
            console.log(responseData)
            // Optionally, reset the form
            document.getElementById('mp3-upload-form').reset();
        } else {
            alert('Failed to upload files.');
            throw responseData
        }
    }
    catch (error) {
        console.error(error);
        alert('An error occurred while uploading files.');
    }
});


