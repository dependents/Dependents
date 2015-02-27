module.exports = function(grunt) {
  grunt.initConfig({
    commandFiles: [
      'Dependents.py',
      'JumpToDependency.py',
      'FindDriver.py',
      'TreeCommand.py'
    ],

    touch: {
      options: {
        force: true,
        mtime: true
      },
      src: ['<%= commandFiles %>']
    },

    watch: {
      files: [
        '*.py',
        'vendor/**/.py',
        'lib/**/*.py',
        '!changelogs/**',
        '!<%= commandFiles %>',
        '!tests/**',
        '!node_modules/**',
        '!.git/**'
      ],
      tasks: ['touch']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-touch');

  grunt.registerTask('default', ['watch']);
};