module.exports = function(grunt) {

    grunt.initConfig({
        aws_s3: {
            options: {
                region: 'eu-west-1',
                awsProfile: 'default'
            },
            production: {
                options: {
                    bucket: 'static.nautoguide.com',
                    params: {
                    }
                },
                files: [
                    {expand: true, cwd: 'site/', src: ['**'], dest: 'sites/matchthemiles/'},
                ]
            },
        }
    });
    // Do grunt-related things in here
    grunt.loadNpmTasks('grunt-aws-s3');
};