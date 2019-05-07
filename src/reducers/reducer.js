const initialState = {
  user: {

  },
  editor: {
    loggedIn: false,
    editorFirstName: undefined,
    page: 'editor-login',
    contentResults: [],
    contentResult: [],
    hidden: {
      viewArtistName: false,
      editArtistName: true,
      viewArtistTile: false,
      editArtistTitle: true,
      viewArt: false,
      editArt: true,
      viewCategory: false,
      editCategory: true,
      viewTags: false,
      editTags: true,
      deletePopUp: true,
      dropDown: {
        artistName: true,
        title: true,
        tag: true
      },
    }
  }
}
