import React, {Component} from "react"
import ReactDOM from "react-dom"
import {withRouter} from "react-router"
import TextField from "@material-ui/core/TextField"
import {FormControlLabel} from "@material-ui/core/FormControlLabel"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import FaPlus from "react-icons/lib/md/add-circle"

import styles from "./OfferDetailPage.css"

class OfferDetailPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detail: {
        title: "",
        description: "",
        price: "",
        counter: "",
        files: [],
        fileImages: [],
        imageUploaded: []
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.click = this.click.bind(this)
    this.fileChangedHandler = this.fileChangedHandler.bind(this)
    this.showFileUpload = this.showFileUpload.bind(this)
  }

  handleChange(event) {
    console.log(event.target.id)
    this.setState({
      detail: {...this.state.detail, [event.target.id]: event.target.value}
    })
  }

  click() {
    this.setState(
      {
        detail: {...this.state.detail, submit: true}
      },
      function () {
        this.props.router.push({
          pathname: "/offer/start",
          state: this.state
        })
      }
    )
  }

  fileChangedHandler(event) {
    let files = this.state.detail.files
    files.push(event.target.files[0])
    let fileImages = this.state.detail.fileImages
    fileImages.push(URL.createObjectURL(event.target.files[0]))
    let imageUploaded = this.state.detail.imageUploaded
    imageUploaded.push("block")
    imageUploaded[event.target.id] = "none"

    event.preventDefault()
    this.setState(
      {
        detail: {
          ...this.state.detail,
          selectedFiles: files,
          fileImages: fileImages,
          counter: files.length,
          imageUploaded: imageUploaded
        }
      },
      () => {
        console.log(this.state)
      }
    )
  }

  showFileUpload(image) {
    ReactDOM.findDOMNode(this.refs[image.name].click())
  }

  componentWillMount() {
    this.setState(this.props.location.state)
  }

  render() {
    console.log("Start rendering OfferDetail component ...")
    return (
      <div className={styles.root}>
        <div className={styles.distance}/>
        <div className={styles.container}>
          <div className={styles.innerBox}>
            <Grid className={styles.box} container>
              <label> {this.state.detail.counter} von 5 Bilder</label>
              <Grid item xs={12} sm={12}>
                <Grid container className={styles.upload}>
                  <span>
                    <FaPlus
                      onClick={this.showFileUpload.bind(this, {
                        name: "image0"
                      })}
                      style={{display: this.state.detail.imageUploaded[0]}}
                      size={50}
                    />{" "}
                  </span>
                  <input
                    style={{display: "none"}}
                    ref="image0"
                    id={0}
                    type="file"
                    onChange={this.fileChangedHandler}
                  />
                  <img
                    style={{
                      "max-width": "200px"
                    }}
                    src={this.state.detail.fileImages[0]}
                  />
                </Grid>
              </Grid>

              {
                this.state.detail.files.map(image => {
                  return (
                    <Grid
                      key={this.state.detail.files.indexOf(image) + 1}
                      item
                      xs={3}
                      sm={3}
                    >
                      <Grid
                        container
                        className={styles.upload}
                        style={{height: "200px"}}
                      >
                      <span>
                        <FaPlus
                          onClick={this.showFileUpload.bind(this, {
                            name:
                            "image" +
                            (this.state.detail.files.indexOf(image) + 1)
                          })}
                          style={{
                            display: this.state.detail.imageUploaded[
                            this.state.detail.files.indexOf(image) + 1
                              ]
                          }}
                          size={50}
                        />{" "}
                      </span>
                        <input
                          style={{display: "none"}}
                          id={this.state.detail.files.indexOf(image) + 1}
                          ref={
                            "image" + (this.state.detail.files.indexOf(image) + 1)
                          }
                          type="file"
                          onChange={this.fileChangedHandler}
                        />
                        <img
                          style={{
                            "max-width": "100px"
                          }}
                          src={
                            this.state.detail.fileImages[
                            this.state.detail.files.indexOf(image) + 1
                              ]
                          }
                        />
                      </Grid>
                    </Grid>
                  )
                })}
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  helperText="*required"
                  id="title"
                  label="title"
                  defaultValue={this.state.detail.title}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  id="description"
                  defaultValue={this.state.detail.description}
                  label="description"
                  margin="normal"
                  onChange={this.handleChange}
                  multiline={true}
                  rows={6}
                  placeholder="Buy that badass Lambo Now"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="price"
                  helperText="*required"
                  label="price (in Ether)"
                  defaultValue={this.state.detail.price}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>

              <Grid className={styles.footer} item xs={12} sm={12}/>
            </Grid>

            <Grid item xs={12} sm={12}>
              <div className={styles.seperate}/>
              <Grid className={styles.box}>
                <Button onClick={this.click} variant="raised" color="secondary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(OfferDetailPage)
